import { Component, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { VenueProfile, VenueType } from '../models/profile.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venues.html',
  styleUrl: './venues.css'
})
export class VenuesComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private subscriptions: Subscription[] = [];

  locationQuery = signal('');
  selectedTypes = signal<VenueType[]>([]);
  allVenues = signal<VenueProfile[]>([]);
  upcomingEventCounts = signal<Record<string, number>>({});

  venueTypes: { type: VenueType; icon: string }[] = [
    { type: 'Restaurant', icon: '🍽️' },
    { type: 'Theatre', icon: '🎭' },
    { type: 'Events Space', icon: '🎪' },
    { type: 'Bar', icon: '🍹' },
    { type: 'Night Club', icon: '🪩' },
    { type: 'Park / Public Space', icon: '🌳' },
    { type: 'Community Center', icon: '🏛️' },
    { type: 'Gallery / Museum', icon: '🖼️' },
    { type: 'Private Venue', icon: '🔒' },
  ];

  private stateNames: Record<string, string> = {
    'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas',
    'CA': 'california', 'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware',
    'FL': 'florida', 'GA': 'georgia', 'HI': 'hawaii', 'ID': 'idaho',
    'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa', 'KS': 'kansas',
    'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
    'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi',
    'MO': 'missouri', 'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada',
    'NH': 'new hampshire', 'NJ': 'new jersey', 'NM': 'new mexico', 'NY': 'new york',
    'NC': 'north carolina', 'ND': 'north dakota', 'OH': 'ohio', 'OK': 'oklahoma',
    'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode island', 'SC': 'south carolina',
    'SD': 'south dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah',
    'VT': 'vermont', 'VA': 'virginia', 'WA': 'washington', 'WV': 'west virginia',
    'WI': 'wisconsin', 'WY': 'wyoming', 'DC': 'district of columbia'
  };

  filteredVenues = computed(() => {
    let venues = this.allVenues();
    const loc = this.locationQuery().toLowerCase().trim();
    const types = this.selectedTypes();

    if (loc) {
      venues = venues.filter(v => {
        const stateFullName = this.stateNames[v.state.toUpperCase()] || '';
        return v.name.toLowerCase().includes(loc) ||
               v.city.toLowerCase().includes(loc) ||
               v.state.toLowerCase().includes(loc) ||
               stateFullName.includes(loc) ||
               v.zipCode.includes(loc) ||
               v.address.toLowerCase().includes(loc);
      });
    }

    if (types.length > 0) {
      venues = venues.filter(v => types.includes(v.venueType));
    }

    return venues;
  });

  getUpcomingEventCount(venueId: string): number {
    return this.upcomingEventCounts()[venueId] || 0;
  }

  ngOnInit(): void {
    const venuesSub = this.profileService.getAllVenues().subscribe(venues => {
      this.allVenues.set(venues);
    });
    this.subscriptions.push(venuesSub);

    const today = new Date().toISOString().split('T')[0];
    const eventsSub = this.profileService.getAllEvents().subscribe(events => {
      const counts: Record<string, number> = {};
      for (const event of events) {
        if (event.date >= today && event.venueId) {
          counts[event.venueId] = (counts[event.venueId] || 0) + 1;
        }
      }
      this.upcomingEventCounts.set(counts);
    });
    this.subscriptions.push(eventsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggleType(type: VenueType): void {
    const current = this.selectedTypes();
    if (current.includes(type)) {
      this.selectedTypes.set(current.filter(t => t !== type));
    } else {
      this.selectedTypes.set([...current, type]);
    }
  }

  isTypeSelected(type: VenueType): boolean {
    return this.selectedTypes().includes(type);
  }

  getTypeIcon(type: VenueType): string {
    return this.venueTypes.find(vt => vt.type === type)?.icon || '📍';
  }

  clearFilters(): void {
    this.locationQuery.set('');
    this.selectedTypes.set([]);
  }

  hasActiveFilters(): boolean {
    return this.locationQuery().length > 0 || this.selectedTypes().length > 0;
  }
}