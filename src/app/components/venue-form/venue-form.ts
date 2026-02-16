import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { StorageService } from '../../services/storage.service';
import { Venue } from '../../models/venue.model';

@Component({
  selector: 'app-venue-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './venue-form.html',
  styleUrl: './venue-form.css',
})
export class VenueForm {
  venueForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';
  private db = db;

  amenitiesOptions = [
    'Bar',
    'Full Kitchen',
    'Sound System',
    'Stage',
    'Dance Floor',
    'Outdoor Space',
    'Parking',
    'Coat Check'
  ];

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService
  ) {
    this.venueForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      instagram: [''],
      facebook: [''],
      twitter: [''],
      capacity: [''],
      accessibility: [''],
      amenities: this.fb.group({
        bar: [false],
        fullKitchen: [false],
        soundSystem: [false],
        stage: [false],
        danceFloor: [false],
        outdoorSpace: [false],
        parking: [false],
        coatCheck: [false]
      })
    });
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

  async onSubmit(): Promise<void> {
    if (this.venueForm.invalid) {
      this.venueForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      // Upload image if selected
      let venueImageUrl = '';
      if (this.selectedImage) {
        venueImageUrl = await this.storageService.uploadImage(
          this.selectedImage,
          'venues'
        );
      }

      // Get selected amenities
      const amenitiesGroup = this.venueForm.get('amenities')?.value;
      const selectedAmenities = Object.keys(amenitiesGroup)
        .filter(key => amenitiesGroup[key])
        .map(key => this.convertCamelToReadable(key));

      // Prepare venue data
      const venueData: Venue = {
        name: this.venueForm.value.name,
        address: this.venueForm.value.address,
        city: this.venueForm.value.city,
        state: this.venueForm.value.state,
        zipCode: this.venueForm.value.zipCode,
        description: this.venueForm.value.description,
        email: this.venueForm.value.email,
        phone: this.venueForm.value.phone,
        website: this.venueForm.value.website,
        socialMedia: {
          instagram: this.venueForm.value.instagram,
          facebook: this.venueForm.value.facebook,
          twitter: this.venueForm.value.twitter
        },
        capacity: this.venueForm.value.capacity ? Number(this.venueForm.value.capacity) : undefined,
        amenities: selectedAmenities,
        accessibility: this.venueForm.value.accessibility,
        venueImageUrl: venueImageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Firestore
      const venuesCollection = collection(this.db, 'venues');
      await addDoc(venuesCollection, venueData);

      this.submitSuccess = true;
      this.venueForm.reset();
      this.selectedImage = null;
      this.imagePreview = null;

      // Reset success message after 3 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 3000);

    } catch (error) {
      console.error('Error submitting venue profile:', error);
      this.errorMessage = 'An error occurred while submitting your venue profile. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private convertCamelToReadable(camelCase: string): string {
    const result = camelCase.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
