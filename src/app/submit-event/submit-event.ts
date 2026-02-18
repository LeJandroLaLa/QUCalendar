import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { ProfileService } from '../services/profile.service';
import { VenueProfile, ArtistProfile } from '../models/profile.model';
import { ImageUploadComponent } from '../shared/image-upload/image-upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-submit-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageUploadComponent],
  templateUrl: './submit-event.html',
  styleUrl: './submit-event.css'
})
export class SubmitEventComponent implements OnInit, OnDestroy {
  submitted = signal(false);
  submitting = signal(false);
  error = signal('');

  venues = signal<VenueProfile[]>([]);
  artists = signal<ArtistProfile[]>([]);
  private subscriptions: Subscription[] = [];

  allCategories: string[] = [
    'Nightlife', 'Drag', 'Fashion', 'Fundraiser', 'Karaoke',
    'Leather', 'Movies', 'Community', 'Travel', 'Brunch',
    'Sports', 'Live Show', 'Sober', 'Workshop', 'Outdoors',
    'Wellness', 'DJ Sets', 'Art/Photo', 'Multi-Day', 'Trivia'
  ];

  categoryIcons: Record<string, string> = {
    'Nightlife': '🌟', 'Drag': '💃', 'Fashion': '👕', 'Fundraiser': '💰',
    'Karaoke': '🎤', 'Leather': '🔗', 'Movies': '🎬', 'Community': '🤝',
    'Travel': '✈️', 'Brunch': '🥞', 'Sports': '⚽', 'Live Show': '🎵',
    'Sober': '✨', 'Workshop': '💼', 'Outdoors': '🏞️', 'Wellness': '🧘',
    'DJ Sets': '🎧', 'Art/Photo': '📸', 'Multi-Day': '📅', 'Trivia': '💬',
  };

  form = {
    name: '',
    description: '',
    date: '',
    endDate: '',
    isMultiDay: false,
    startTime: '',
    endTime: '',
    price: '',
    category: [] as string[],
    venueId: '',
    venueName: '',
    venueAddress: '',
    artistIds: [] as string[],
    artistNames: [] as string[],
    isAccessible: false,
    ticketUrl: '',
    eventImageUrl: '',
    contactEmail: '',
    contactPhone: '',
  };

  constructor(
    private firestore: Firestore,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const venueSub = this.profileService.getAllVenues().subscribe(venues => {
      this.venues.set(venues);
    });
    const artistSub = this.profileService.getAllArtists().subscribe(artists => {
      this.artists.set(artists);
    });
    this.subscriptions.push(venueSub, artistSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getCategoryIcon(cat: string): string {
    return this.categoryIcons[cat] || '🏷️';
  }

  toggleCategory(cat: string): void {
    const current = this.form.category;
    if (current.includes(cat)) {
      this.form.category = current.filter(c => c !== cat);
    } else {
      this.form.category = [...current, cat];
    }
    // Auto-toggle Multi-Day when endDate is set
    if (cat === 'Multi-Day') return;
    if (this.form.isMultiDay && !this.form.category.includes('Multi-Day')) {
      this.form.category = [...this.form.category, 'Multi-Day'];
    }
  }

  isCategorySelected(cat: string): boolean {
    return this.form.category.includes(cat);
  }

  onMultiDayToggle(): void {
    this.form.isMultiDay = !this.form.isMultiDay;
    if (!this.form.isMultiDay) {
      this.form.endDate = '';
      this.form.category = this.form.category.filter(c => c !== 'Multi-Day');
    } else {
      if (!this.form.category.includes('Multi-Day')) {
        this.form.category = [...this.form.category, 'Multi-Day'];
      }
    }
  }

  onVenueChange(): void {
    const venue = this.venues().find(v => v.id === this.form.venueId);
    if (venue) {
      this.form.venueName = venue.name;
      this.form.venueAddress = `${venue.address}, ${venue.city}, ${venue.state} ${venue.zipCode}`;
      this.form.isAccessible = venue.isAccessible;
    }
  }

  toggleArtist(artist: ArtistProfile): void {
    const ids = this.form.artistIds;
    if (ids.includes(artist.id)) {
      const idx = ids.indexOf(artist.id);
      this.form.artistIds = ids.filter(id => id !== artist.id);
      this.form.artistNames = this.form.artistNames.filter((_, i) => i !== idx);
    } else {
      this.form.artistIds = [...ids, artist.id];
      this.form.artistNames = [...this.form.artistNames, artist.name];
    }
  }

  isArtistSelected(artistId: string): boolean {
    return this.form.artistIds.includes(artistId);
  }

  async onSubmit(): Promise<void> {
    this.error.set('');

    if (!this.form.name.trim()) {
      this.error.set('Event name is required.');
      return;
    }
    if (!this.form.date) {
      this.error.set('Event date is required.');
      return;
    }
    if (this.form.isMultiDay && !this.form.endDate) {
      this.error.set('End date is required for multi-day events.');
      return;
    }
    if (this.form.isMultiDay && this.form.endDate <= this.form.date) {
      this.error.set('End date must be after start date.');
      return;
    }
    if (!this.form.startTime.trim()) {
      this.error.set('Start time is required.');
      return;
    }
    if (!this.form.venueId) {
      this.error.set('Please select a venue.');
      return;
    }
    if (this.form.category.length === 0) {
      this.error.set('Please select at least one category.');
      return;
    }

    this.submitting.set(true);

    try {
      const eventData = {
        name: this.form.name.trim(),
        description: this.form.description.trim(),
        date: this.form.date,
        ...(this.form.isMultiDay && this.form.endDate ? { endDate: this.form.endDate } : {}),
        startTime: this.form.startTime.trim(),
        endTime: this.form.endTime.trim(),
        price: this.form.price.trim() || 'Free',
        category: this.form.category,
        venueId: this.form.venueId,
        venueName: this.form.venueName,
        venueAddress: this.form.venueAddress,
        artistIds: this.form.artistIds,
        artistNames: this.form.artistNames,
        isAccessible: this.form.isAccessible,
        ticketUrl: this.form.ticketUrl.trim(),
        eventImageUrl: this.form.eventImageUrl,
        contactEmail: this.form.contactEmail.trim(),
        contactPhone: this.form.contactPhone.trim(),
        status: 'pending',
        type: 'event',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(this.firestore, 'events'), eventData);
      this.submitted.set(true);
    } catch (err) {
      console.error('Error submitting event:', err);
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm(): void {
    this.submitted.set(false);
    this.error.set('');
    this.form = {
      name: '', description: '', date: '', endDate: '',
      isMultiDay: false, startTime: '', endTime: '', price: '',
      category: [], venueId: '', venueName: '', venueAddress: '',
      artistIds: [], artistNames: [], isAccessible: false,
      ticketUrl: '', eventImageUrl: '', contactEmail: '', contactPhone: '',
    };
  }
}