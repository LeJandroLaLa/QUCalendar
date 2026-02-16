import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { StorageService } from '../../services/storage.service';
import { Event } from '../../models/event.model';
import { Venue } from '../../models/venue.model';
import { Performer } from '../../models/performer.model';

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit {
  eventForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';
  venues: Venue[] = [];
  performers: Performer[] = [];
  isLoadingVenues = false;
  isLoadingPerformers = false;
  private db = db;

  eventTypeOptions = [
    'Drag Show',
    'Comedy Night',
    'Burlesque Show',
    'Live Music',
    'DJ Night',
    'Theater Performance',
    'Dance Performance',
    'Poetry/Spoken Word',
    'Cabaret',
    'Pride Event',
    'Fundraiser',
    'Social Gathering',
    'Other'
  ];

  ageRestrictionOptions = [
    'All Ages',
    '18+',
    '21+'
  ];

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      eventType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      startTime: ['', Validators.required],
      endTime: [''],
      venueId: ['', Validators.required],
      performerIds: [[]],
      ticketPrice: [''],
      ticketUrl: [''],
      tags: [''],
      ageRestriction: ['All Ages'],
      accessibility: [''],
      contactEmail: ['', Validators.email]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadVenues();
    await this.loadPerformers();
  }

  async loadVenues(): Promise<void> {
    this.isLoadingVenues = true;
    try {
      const venuesCollection = collection(this.db, 'venues');
      const venuesSnapshot = await getDocs(venuesCollection);
      this.venues = venuesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Venue));
    } catch (error) {
      console.error('Error loading venues:', error);
      this.errorMessage = 'Failed to load venues';
    } finally {
      this.isLoadingVenues = false;
    }
  }

  async loadPerformers(): Promise<void> {
    this.isLoadingPerformers = true;
    try {
      const performersCollection = collection(this.db, 'performers');
      const performersSnapshot = await getDocs(performersCollection);
      this.performers = performersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Performer));
    } catch (error) {
      console.error('Error loading performers:', error);
      this.errorMessage = 'Failed to load performers';
    } finally {
      this.isLoadingPerformers = false;
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }

      this.selectedImage = file;
      this.errorMessage = '';

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  onPerformerChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
    this.eventForm.patchValue({ performerIds: selectedOptions });
  }

  async onSubmit(): Promise<void> {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      // Upload image if selected
      let eventImageUrl = '';
      if (this.selectedImage) {
        eventImageUrl = await this.storageService.uploadImage(
          this.selectedImage,
          'events'
        );
      }

      // Get venue name
      const selectedVenue = this.venues.find(v => v.id === this.eventForm.value.venueId);
      const venueName = selectedVenue?.name || '';

      // Get performer names
      const selectedPerformerIds = this.eventForm.value.performerIds || [];
      const performerNames = this.performers
        .filter(p => selectedPerformerIds.includes(p.id))
        .map(p => p.name);

      // Parse tags
      const tags = this.eventForm.value.tags
        ? this.eventForm.value.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

      // Prepare event data
      const eventData: Event = {
        title: this.eventForm.value.title,
        description: this.eventForm.value.description,
        eventType: this.eventForm.value.eventType,
        startDate: new Date(this.eventForm.value.startDate),
        endDate: this.eventForm.value.endDate ? new Date(this.eventForm.value.endDate) : undefined,
        startTime: this.eventForm.value.startTime,
        endTime: this.eventForm.value.endTime,
        venueId: this.eventForm.value.venueId,
        venueName: venueName,
        performerIds: selectedPerformerIds,
        performerNames: performerNames,
        ticketPrice: this.eventForm.value.ticketPrice,
        ticketUrl: this.eventForm.value.ticketUrl,
        eventImageUrl: eventImageUrl,
        tags: tags,
        ageRestriction: this.eventForm.value.ageRestriction,
        accessibility: this.eventForm.value.accessibility,
        contactEmail: this.eventForm.value.contactEmail,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Firestore
      const eventsCollection = collection(this.db, 'events');
      await addDoc(eventsCollection, eventData);

      this.submitSuccess = true;
      this.eventForm.reset();
      this.eventForm.patchValue({ ageRestriction: 'All Ages' });
      this.selectedImage = null;
      this.imagePreview = null;

      // Reset success message after 3 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 3000);

    } catch (error) {
      console.error('Error submitting event:', error);
      this.errorMessage = 'An error occurred while submitting your event. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
