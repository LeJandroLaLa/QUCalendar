import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { VenueProfile, VenueType } from '../models/profile.model';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venues.html',
  styleUrl: './venues.css'
})
export class VenuesComponent implements OnInit {
  private profileService = new ProfileService();

  // Filter state
  locationQuery = signal('');
  selectedTypes = signal<VenueType[]>([]);

  // All venues from service
  allVenues = signal<VenueProfile[]>([]);

  // Venue type definitions with icons
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

  // US state name lookup for location search
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

  // Computed filtered venues
  filteredVenues = computed(() => {
    let venues = this.allVenues();
    const loc = this.locationQuery().toLowerCase().trim();
    const types = this.selectedTypes();

    // Location filter
    if (loc) {
      venues = venues.filter(v => {
        const name = v.name.toLowerCase();
        const city = v.city.toLowerCase();
        const state = v.state.toLowerCase();
        const zip = v.zip;
        const address = v.address.toLowerCase();

        // Check state full name match
        const stateFullName = this.stateNames[v.state.toUpperCase()] || '';

        return name.includes(loc) ||
               city.includes(loc) ||
               state.includes(loc) ||
               stateFullName.includes(loc) ||
               zip.includes(loc) ||
               address.includes(loc);
      });
    }

    // Type filter
    if (types.length > 0) {
      venues = venues.filter(v => types.includes(v.venueType));
    }

    return venues;
  });

  // Count of upcoming events per venue
  getUpcomingEventCount(venueId: string): number {
    const today = new Date().toISOString().split('T')[0];
    return this.profileService.getEventsByVenue(venueId)
      .filter(e => e.date >= today).length;
  }

  ngOnInit() {
    this.allVenues.set(this.profileService.getAllVenues());
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
