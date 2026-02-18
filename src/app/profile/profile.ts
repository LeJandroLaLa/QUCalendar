import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import {
  EventProfile,
  VenueProfile,
  ArtistProfile,
  SocialLink,
} from '../models/profile.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile = signal<EventProfile | VenueProfile | ArtistProfile | undefined>(undefined);
  profileType = signal<string>('');
  upcomingEvents = signal<EventProfile[]>([]);
  pastEvents = signal<EventProfile[]>([]);

  private subscriptions: Subscription[] = [];

  eventProfile = computed(() =>
    this.profile()?.type === 'event' ? (this.profile() as EventProfile) : null
  );
  venueProfile = computed(() =>
    this.profile()?.type === 'venue' ? (this.profile() as VenueProfile) : null
  );
  artistProfile = computed(() =>
    this.profile()?.type === 'artist' ? (this.profile() as ArtistProfile) : null
  );

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.params.subscribe(params => {
      const type = params['type'];
      const id = params['id'];
      this.profileType.set(type);

      const profileSub = this.profileService.getProfileByTypeAndId(type, id).subscribe(profile => {
        this.profile.set(profile);
        if (profile) {
          this.loadRelatedEvents(profile);
        }
      });
      this.subscriptions.push(profileSub);
    });
    this.subscriptions.push(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadRelatedEvents(profile: EventProfile | VenueProfile | ArtistProfile): void {
    const today = new Date().toISOString().split('T')[0];

    if (profile.type === 'venue') {
      const sub = this.profileService.getEventsByVenue(profile.id).subscribe(events => {
        this.upcomingEvents.set(
          events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
        );
        this.pastEvents.set(
          events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
        );
      });
      this.subscriptions.push(sub);
    } else if (profile.type === 'artist') {
      const sub = this.profileService.getEventsByArtist(profile.id).subscribe(events => {
        this.upcomingEvents.set(
          events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
        );
        this.pastEvents.set(
          events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
        );
      });
      this.subscriptions.push(sub);
    }
  }

  // ==========================================
  // DATE HELPERS
  // ==========================================

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

  getYear(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').getFullYear().toString();
  }

  // ==========================================
  // DISPLAY HELPERS (work across all profile types)
  // ==========================================

  getDisplayTagline(): string {
    const p = this.profile();
    if (!p) return '';
    if (p.type === 'venue') return (p as VenueProfile).tagline;
    if (p.type === 'artist') return (p as ArtistProfile).tagline;
    return '';
  }

  getDisplayAvatarEmoji(): string {
    const p = this.profile();
    if (!p) return '🎫';
    if (p.type === 'venue') return (p as VenueProfile).avatarEmoji;
    if (p.type === 'artist') return (p as ArtistProfile).avatarEmoji;
    return '🎫';
  }

  getDisplayImageUrl(): string | undefined {
    const p = this.profile();
    if (!p) return undefined;
    if (p.type === 'venue') return (p as VenueProfile).venueImageUrl;
    if (p.type === 'artist') return (p as ArtistProfile).artistImageUrl;
    return (p as EventProfile).eventImageUrl;
  }

  getDisplayTags(): string[] {
    const p = this.profile();
    if (!p) return [];
    if (p.type === 'venue') return (p as VenueProfile).tags;
    if (p.type === 'artist') return (p as ArtistProfile).tags;
    return (p as EventProfile).category;
  }

  getDisplaySocialLinks(): SocialLink[] {
    const p = this.profile();
    if (!p) return [];
    if (p.type === 'venue') return (p as VenueProfile).socialLinks;
    if (p.type === 'artist') return (p as ArtistProfile).socialLinks;
    return [];
  }

  getProfileTypeBadge(): string {
    switch (this.profileType()) {
      case 'events': return 'Event';
      case 'venues': return 'Venue';
      case 'artists': return 'Artist';
      default: return '';
    }
  }
}