import { Component, OnInit, OnChanges, SimpleChanges, Input, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { EventProfile } from '../models/profile.model';
import { Subscription } from 'rxjs';

interface DayGroup {
  date: string;
  dayNumber: number;
  month: string;
  dayOfWeek: string;
  fullDate: string;
  events: EventProfile[];
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class EventsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() locationFilter: string = '';
  @Input() keywordFilter: string = '';
  @Input() dateFilter: string = '';
  @Input() categoryFilter: string[] = [];
  @Input() viewMode: 'calendar' | 'list' = 'calendar';

  dayGroups = signal<DayGroup[]>([]);
  flatEvents = signal<EventProfile[]>([]);

  private allEvents: EventProfile[] = [];
  private subscription?: Subscription;

  categoryIcons: Record<string, string> = {
    'Nightlife': '🌟', 'Drag': '💃', 'Fashion': '👕', 'Fundraiser': '💰',
    'Karaoke': '🎤', 'Leather': '🔗', 'Movies': '🎬', 'Community': '🤝',
    'Travel': '✈️', 'Brunch': '🥞', 'Sports': '⚽', 'Live Show': '🎵',
    'Sober': '✨', 'Workshop': '💼', 'Outdoors': '🏞️', 'Wellness': '🧘',
    'DJ Sets': '🎧', 'Art/Photo': '📸', 'Multi-Day': '📅', 'Trivia': '💬',
    'Comedy': '😂',
  };

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || '🏷️';
  }

  // Date helpers — computed from ISO date string, no stored fields needed
  getDayNumber(dateStr: string): number {
    return new Date(dateStr + 'T00:00:00').getDate();
  }

  getMonth(dateStr: string): string {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return months[new Date(dateStr + 'T00:00:00').getMonth()];
  }

  getDayOfWeek(dateStr: string): string {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[new Date(dateStr + 'T00:00:00').getDay()];
  }

  getFullDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.subscription = this.profileService.getUpcomingEvents().subscribe(events => {
      this.allEvents = events;
      this.applyFilters();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private applyFilters(): void {
  let events = [...this.allEvents];

  // Location filter
  if (this.locationFilter && this.locationFilter.trim()) {
    const q = this.locationFilter.toLowerCase().trim();
    events = events.filter(e =>
      e.venueName.toLowerCase().includes(q) ||
      e.venueAddress.toLowerCase().includes(q)
    );
  }

  // Keyword filter — matches name, venue, description, categories
  if (this.keywordFilter && this.keywordFilter.trim()) {
    const q = this.keywordFilter.toLowerCase().trim();
    events = events.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.venueName.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.some(cat => cat.toLowerCase().includes(q))
    );
  }

  // Date filter
  if (this.dateFilter) {
    if (this.dateFilter === 'weekend') {
      events = events.filter(e => {
        const day = new Date(e.date + 'T00:00:00').getDay();
        return day === 0 || day === 6;
      });
    } else if (this.dateFilter.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const parts = this.dateFilter.split('/');
      const isoDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
      events = events.filter(e => e.date === isoDate);
    }
  }

  // Category filter
  if (this.categoryFilter && this.categoryFilter.length > 0) {
    events = events.filter(e =>
      this.categoryFilter.some(cat => e.category.includes(cat))
    );
  }

  this.flatEvents.set(events);
  this.dayGroups.set(this.groupByDay(events));
}

  private groupByDay(events: EventProfile[]): DayGroup[] {
    const map = new Map<string, EventProfile[]>();
    for (const event of events) {
      const existing = map.get(event.date) || [];
      existing.push(event);
      map.set(event.date, existing);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, evts]) => ({
        date,
        dayNumber: this.getDayNumber(date),
        month: this.getMonth(date),
        dayOfWeek: this.getDayOfWeek(date),
        fullDate: this.getFullDate(date),
        events: evts,
      }));
  }

  calculateStardate(dateStr: string, time: string): string {
    const year = new Date(dateStr + 'T00:00:00').getFullYear();
    const start = new Date(year, 0, 0);
    const diff = new Date(dateStr + 'T00:00:00').getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hourFraction = this.parseTimeToFraction(time);
    return (year * 10 + (dayOfYear / 365) * 10 + hourFraction).toFixed(2);
  }

  private parseTimeToFraction(time: string): number {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return ((hours * 60 + minutes) / (24 * 60)) * 0.1;
  }
}