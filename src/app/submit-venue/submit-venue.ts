import { ImageUploadComponent } from '../shared/image-upload/image-upload';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { VenueType } from '../models/profile.model';

@Component({
  selector: 'app-submit-venue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageUploadComponent],
  templateUrl: './submit-venue.html',
  styleUrl: './submit-venue.css'
})
export class SubmitVenueComponent {
  submitted = signal(false);
  submitting = signal(false);
  error = signal('');

  venueTypes: VenueType[] = [
    'Restaurant', 'Theatre', 'Events Space', 'Bar', 'Night Club',
    'Park / Public Space', 'Community Center', 'Gallery / Museum', 'Private Venue'
  ];

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  form = {
    venueImageUrl: '',
    name: '',
    tagline: '',
    description: '',
    venueType: '' as VenueType | '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    capacity: null as number | null,
    isAccessible: false,
    parking: '',
    transit: '',
    amenities: [] as string[],
    hours: this.days.map(day => ({ day, time: '' })),
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    bookingUrl: '',
    avatarEmoji: '🏛️',
    tags: '',
    features: '',
  };

  amenityOptions = [
    'Bar', 'Full Bar', 'Beer/Wine Only', 'Sound System', 'Stage',
    'Dance Floor', 'Outdoor Space', 'Parking', 'Food Menu', 'Brunch Menu',
    'Dog Friendly', 'All Ages', '21+', 'Private Rooms', 'AV Equipment'
  ];

  constructor(private firestore: Firestore) {}

  toggleAmenity(amenity: string): void {
    const current = this.form.amenities;
    if (current.includes(amenity)) {
      this.form.amenities = current.filter(a => a !== amenity);
    } else {
      this.form.amenities = [...current, amenity];
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.form.amenities.includes(amenity);
  }

  async onSubmit(): Promise<void> {
    this.error.set('');

    // Basic validation
    if (!this.form.name.trim()) {
      this.error.set('Venue name is required.');
      return;
    }
    if (!this.form.venueType) {
      this.error.set('Please select a venue type.');
      return;
    }
    if (!this.form.address.trim() || !this.form.city.trim() || !this.form.state.trim()) {
      this.error.set('Address, city, and state are required.');
      return;
    }
    if (!this.form.contactEmail.trim()) {
      this.error.set('Contact email is required.');
      return;
    }

    this.submitting.set(true);

    try {
      const tagsArray = this.form.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const featuresArray = this.form.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)
        .map(f => ({ icon: '✨', label: f }));

      const hoursFiltered = this.form.hours.filter(h => h.time.trim().length > 0);

      const venueData = {
        venueImageUrl: this.form.venueImageUrl,
        name: this.form.name.trim(),
        tagline: this.form.tagline.trim(),
        description: this.form.description.trim(),
        venueType: this.form.venueType,
        address: this.form.address.trim(),
        city: this.form.city.trim(),
        state: this.form.state.trim().toUpperCase(),
        zipCode: this.form.zipCode.trim(),
        contactPhone: this.form.contactPhone.trim(),
        contactEmail: this.form.contactEmail.trim(),
        website: this.form.website.trim(),
        capacity: this.form.capacity || 0,
        isAccessible: this.form.isAccessible,
        parking: this.form.parking.trim(),
        transit: this.form.transit.trim(),
        amenities: this.form.amenities,
        features: featuresArray,
        hours: hoursFiltered,
        tags: tagsArray,
        avatarEmoji: this.form.avatarEmoji.trim() || '🏛️',
        socialLinks: [
          ...(this.form.socialLinks.facebook ? [{ platform: 'Facebook', icon: '📘', url: this.form.socialLinks.facebook }] : []),
          ...(this.form.socialLinks.instagram ? [{ platform: 'Instagram', icon: '📸', url: this.form.socialLinks.instagram }] : []),
          ...(this.form.socialLinks.twitter ? [{ platform: 'Twitter', icon: '🐦', url: this.form.socialLinks.twitter }] : []),
        ],
        bookingUrl: this.form.bookingUrl.trim(),
        status: 'pending',
        type: 'venue',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(this.firestore, 'venues'), venueData);
      this.submitted.set(true);
    } catch (err) {
      console.error('Error submitting venue:', err);
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm(): void {
    this.submitted.set(false);
    this.error.set('');
    this.form = {
      venueImageUrl: '',
      name: '',
      tagline: '',
      description: '',
      venueType: '' as VenueType | '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contactPhone: '',
      contactEmail: '',
      website: '',
      capacity: null,
      isAccessible: false,
      parking: '',
      transit: '',
      amenities: [],
      hours: this.days.map(day => ({ day, time: '' })),
      socialLinks: { facebook: '', instagram: '', twitter: '' },
      bookingUrl: '',
      avatarEmoji: '🏛️',
      tags: '',
      features: '',
    };
  }
}