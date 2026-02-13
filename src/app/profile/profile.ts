import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import {
  EventProfile,
  VenueProfile,
  ArtistProfile,
} from '../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  profile = signal<EventProfile | VenueProfile | ArtistProfile | undefined>(
    undefined
  );
  profileType = signal<string>('');

  // Typed accessors
  eventProfile = computed(() =>
    this.profile()?.type === 'event' ? (this.profile() as EventProfile) : null
  );
  venueProfile = computed(() =>
    this.profile()?.type === 'venue' ? (this.profile() as VenueProfile) : null
  );
  artistProfile = computed(() =>
    this.profile()?.type === 'artist'
      ? (this.profile() as ArtistProfile)
      : null
  );

  // Related data
  upcomingEvents = signal<EventProfile[]>([]);
  pastEvents = signal<EventProfile[]>([]);

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const type = params['type']; // 'events', 'venues', 'artists'
      const id = params['id'];
      this.profileType.set(type);

      const profile = this.profileService.getProfileByTypeAndId(type, id);
      this.profile.set(profile);

      if (profile) {
        this.loadRelatedEvents(profile);
      }
    });
  }

  private loadRelatedEvents(
    profile: EventProfile | VenueProfile | ArtistProfile
  ): void {
    const today = new Date().toISOString().split('T')[0];

    if (profile.type === 'venue') {
      const venue = profile as VenueProfile;
      const allEvents = this.profileService.getEventsByVenue(venue.id);
      this.upcomingEvents.set(
        allEvents.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
      );
      this.pastEvents.set(
        allEvents.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
      );
    } else if (profile.type === 'artist') {
      const artist = profile as ArtistProfile;
      const allEvents = this.profileService.getEventsByArtist(artist.id);
      this.upcomingEvents.set(
        allEvents.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
      );
      this.pastEvents.set(
        allEvents.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
      );
    }
  }

  getProfileTypeBadge(): string {
    switch (this.profileType()) {
      case 'events':
        return 'Event';
      case 'venues':
        return 'Venue';
      case 'artists':
        return 'Artist';
      default:
        return '';
    }
  }
}
