import { ImageUploadComponent } from '../shared/image-upload/image-upload';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-submit-artist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageUploadComponent],
  templateUrl: './submit-artist.html',
  styleUrl: './submit-artist.css'
})
export class SubmitArtistComponent {
  submitted = signal(false);
  submitting = signal(false);
  error = signal('');

  performanceTypeOptions = [
    'Drag Queen', 'Drag King', 'Burlesque', 'Comedy', 'Live Music',
    'DJ', 'Dance', 'Spoken Word', 'Fire Performance', 'Aerial Arts',
    'Hosting/Emcee', 'Trivia Host', 'Karaoke Host', 'Visual Art', 'Other'
  ];

  form = {
    artistImageUrl: '',
    name: '',
    tagline: '',
    description: '',
    basedIn: '',
    willTravel: false,
    bookingEmail: '',
    bookingPhone: '',
    ratesInfo: '',
    avatarEmoji: '🎤',
    tags: '',
    performanceTypes: [] as string[],
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
  };

  constructor(private firestore: Firestore) {}

  togglePerformanceType(type: string): void {
    const current = this.form.performanceTypes;
    if (current.includes(type)) {
      this.form.performanceTypes = current.filter(t => t !== type);
    } else {
      this.form.performanceTypes = [...current, type];
    }
  }

  isPerformanceTypeSelected(type: string): boolean {
    return this.form.performanceTypes.includes(type);
  }

  async onSubmit(): Promise<void> {
    this.error.set('');

    if (!this.form.name.trim()) {
      this.error.set('Artist name is required.');
      return;
    }
    if (!this.form.bookingEmail.trim()) {
      this.error.set('Booking email is required.');
      return;
    }
    if (this.form.performanceTypes.length === 0) {
      this.error.set('Please select at least one performance type.');
      return;
    }

    this.submitting.set(true);

    try {
      const tagsArray = this.form.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const performanceTypesFormatted = this.form.performanceTypes.map(pt => ({
        icon: this.getPerformanceIcon(pt),
        label: pt
      }));

      const artistData = {
        artistImageUrl: this.form.artistImageUrl,
        name: this.form.name.trim(),
        tagline: this.form.tagline.trim(),
        description: this.form.description.trim(),
        basedIn: this.form.basedIn.trim(),
        willTravel: this.form.willTravel,
        bookingEmail: this.form.bookingEmail.trim(),
        bookingPhone: this.form.bookingPhone.trim(),
        ratesInfo: this.form.ratesInfo.trim(),
        avatarEmoji: this.form.avatarEmoji.trim() || '🎤',
        tags: tagsArray,
        performanceTypes: performanceTypesFormatted,
        socialLinks: [
          ...(this.form.socialLinks.facebook ? [{ platform: 'Facebook', icon: '📘', url: this.form.socialLinks.facebook }] : []),
          ...(this.form.socialLinks.instagram ? [{ platform: 'Instagram', icon: '📸', url: this.form.socialLinks.instagram }] : []),
          ...(this.form.socialLinks.twitter ? [{ platform: 'Twitter', icon: '🐦', url: this.form.socialLinks.twitter }] : []),
        ],
        status: 'pending',
        type: 'artist',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(this.firestore, 'artists'), artistData);
      this.submitted.set(true);
    } catch (err) {
      console.error('Error submitting artist:', err);
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm(): void {
    this.submitted.set(false);
    this.error.set('');
    this.form = {
      artistImageUrl: '',
      name: '',
      tagline: '',
      description: '',
      basedIn: '',
      willTravel: false,
      bookingEmail: '',
      bookingPhone: '',
      ratesInfo: '',
      avatarEmoji: '🎤',
      tags: '',
      performanceTypes: [],
      socialLinks: { facebook: '', instagram: '', twitter: '' },
    };
  }

  getPerformanceIcon(type: string): string {
    const icons: Record<string, string> = {
      'Drag Queen': '👑', 'Drag King': '🤴', 'Burlesque': '💃',
      'Comedy': '😂', 'Live Music': '🎵', 'DJ': '🎧',
      'Dance': '🕺', 'Spoken Word': '🎙️', 'Fire Performance': '🔥',
      'Aerial Arts': '🎪', 'Hosting/Emcee': '🎤', 'Trivia Host': '💬',
      'Karaoke Host': '🎤', 'Visual Art': '🎨', 'Other': '✨'
    };
    return icons[type] || '✨';
  }
}