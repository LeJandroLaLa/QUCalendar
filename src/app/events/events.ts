import { Component, OnInit, OnChanges, SimpleChanges, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { EventProfile } from '../models/profile.model';

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
export class EventsComponent implements OnInit, OnChanges {
  @Input() locationFilter: string = '';
  @Input() dateFilter: string = '';
  @Input() categoryFilter: string[] = [];
  @Input() viewMode: 'calendar' | 'list' = 'calendar';

  dayGroups = signal<DayGroup[]>([]);
  flatEvents = signal<EventProfile[]>([]);

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

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let events = this.profileService.getUpcomingEvents();

    // Location filter — matches venue name, address, city, state, or zip
    if (this.locationFilter && this.locationFilter.trim()) {
      const q = this.locationFilter.toLowerCase().trim();
      events = events.filter(e => {
        // Check event-level fields first
        if (e.venueName.toLowerCase().includes(q) ||
            e.venueAddress.toLowerCase().includes(q)) {
          return true;
        }
        // Also check the venue's dedicated city/state/zip if available
        const venue = this.profileService.getVenueById(e.venueId);
        if (venue) {
          return venue.city.toLowerCase().includes(q) ||
                 venue.state.toLowerCase().includes(q) ||
                 venue.zip.includes(q) ||
                 // Match full state names
                 this.matchStateName(q, venue.state);
        }
        return false;
      });
    }

    // Date filter
    if (this.dateFilter) {
      if (this.dateFilter === 'weekend') {
        // Show events on the next Saturday + Sunday
        events = events.filter(e => {
          const d = new Date(e.date + 'T00:00:00');
          const day = d.getDay();
          return day === 0 || day === 6; // Sunday = 0, Saturday = 6
        });
      } else if (this.dateFilter.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        // Specific date: mm/dd/yyyy → yyyy-mm-dd
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

    // Store flat list for list view
    this.flatEvents.set(events);

    // Group by day for calendar view
    const groups = this.groupByDay(events);
    this.dayGroups.set(groups);
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
        dayNumber: evts[0].dayNumber,
        month: evts[0].month,
        dayOfWeek: evts[0].dayOfWeek,
        fullDate: evts[0].fullDate,
        events: evts,
      }));
  }

  calculateStardate(dateStr: string, time: string): string {
    const year = new Date(dateStr).getFullYear();
    const start = new Date(year, 0, 0);
    const diff = new Date(dateStr).getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const hourFraction = this.parseTimeToFraction(time);
    const stardate = (year * 10 + (dayOfYear / 365) * 10 + hourFraction).toFixed(2);
    return stardate;
  }

  private stateNames: Record<string, string> = {
    'OH': 'ohio', 'KY': 'kentucky', 'IN': 'indiana', 'PA': 'pennsylvania',
    'WV': 'west virginia', 'MI': 'michigan', 'IL': 'illinois', 'TN': 'tennessee',
    'VA': 'virginia', 'NC': 'north carolina', 'GA': 'georgia', 'FL': 'florida',
    'NY': 'new york', 'CA': 'california', 'TX': 'texas', 'WA': 'washington',
    'OR': 'oregon', 'CO': 'colorado', 'MA': 'massachusetts', 'CT': 'connecticut',
    'NJ': 'new jersey', 'MD': 'maryland', 'DC': 'district of columbia',
    'MN': 'minnesota', 'WI': 'wisconsin', 'MO': 'missouri', 'IA': 'iowa',
    'SC': 'south carolina', 'AL': 'alabama', 'LA': 'louisiana', 'MS': 'mississippi',
    'AR': 'arkansas', 'OK': 'oklahoma', 'KS': 'kansas', 'NE': 'nebraska',
    'SD': 'south dakota', 'ND': 'north dakota', 'MT': 'montana', 'WY': 'wyoming',
    'ID': 'idaho', 'UT': 'utah', 'NV': 'nevada', 'AZ': 'arizona', 'NM': 'new mexico',
    'AK': 'alaska', 'HI': 'hawaii', 'ME': 'maine', 'NH': 'new hampshire',
    'VT': 'vermont', 'RI': 'rhode island', 'DE': 'delaware',
  };

  private matchStateName(query: string, stateAbbr: string): boolean {
    const fullName = this.stateNames[stateAbbr.toUpperCase()];
    return fullName ? fullName.includes(query) : false;
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
