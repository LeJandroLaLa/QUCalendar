import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsComponent } from '../events/events';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, EventsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // Filter state
  locationQuery = signal('');
  dateQuery = signal('');
  selectedCategories = signal<string[]>([]);
  activeView = signal<'calendar' | 'list'>('calendar');
  showEventTypes = signal(true);

  // Category icon map
  categoryIcons: Record<string, string> = {
    'Nightlife': '🌟', 'Drag': '💃', 'Fashion': '👕', 'Fundraiser': '💰',
    'Karaoke': '🎤', 'Leather': '🔗', 'Movies': '🎬', 'Community': '🤝',
    'Travel': '✈️', 'Brunch': '🥞', 'Sports': '⚽', 'Live Show': '🎵',
    'Sober': '✨', 'Workshop': '💼', 'Outdoors': '🏞️', 'Wellness': '🧘',
    'DJ Sets': '🎧', 'Art/Photo': '📸', 'Multi-Day': '📅', 'Trivia': '💬',
  };

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || '🏷️';
  }

  // All category names (must match ProfileService category strings)
  allCategories: string[] = [
    'Nightlife', 'Drag', 'Fashion', 'Fundraiser', 'Karaoke',
    'Leather', 'Movies', 'Community', 'Travel', 'Brunch',
    'Sports', 'Live Show', 'Sober', 'Workshop', 'Outdoors',
    'Wellness', 'DJ Sets', 'Art/Photo', 'Multi-Day', 'Trivia'
  ];

  // Toggle a category on/off
  toggleCategory(category: string): void {
    const current = this.selectedCategories();
    if (current.includes(category)) {
      this.selectedCategories.set(current.filter(c => c !== category));
    } else {
      this.selectedCategories.set([...current, category]);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
  }

  // Quick filters
  setToday(): void {
    const today = new Date();
    this.dateQuery.set(this.formatDate(today));
  }

  setWeekend(): void {
    // Find the next Saturday
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;

    // If today IS Saturday or Sunday, use today's date
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      this.dateQuery.set('weekend');
    } else {
      this.dateQuery.set('weekend');
    }
  }

  clearFilters(): void {
    this.locationQuery.set('');
    this.dateQuery.set('');
    this.selectedCategories.set([]);
  }

  // View toggle
  setView(view: 'calendar' | 'list'): void {
    this.activeView.set(view);
  }

  // Toggle event type grid visibility
  toggleEventTypes(): void {
    this.showEventTypes.set(!this.showEventTypes());
  }

  private formatDate(date: Date): string {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const y = date.getFullYear();
    return `${m}/${d}/${y}`;
  }
}
