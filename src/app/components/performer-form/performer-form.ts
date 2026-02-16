import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { StorageService } from '../../services/storage.service';
import { Performer } from '../../models/performer.model';

@Component({
  selector: 'app-performer-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './performer-form.html',
  styleUrl: './performer-form.css',
})
export class PerformerForm {
  performerForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';

  performanceTypeOptions = [
    'Drag Performance',
    'Stand-up Comedy',
    'Burlesque',
    'Music - Live Band',
    'Music - DJ',
    'Theater',
    'Dance',
    'Poetry/Spoken Word',
    'Cabaret',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private storageService: StorageService
  ) {
    this.performerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      pronouns: [''],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      instagram: [''],
      facebook: [''],
      twitter: [''],
      tiktok: [''],
      performanceTypes: this.fb.group({
        dragPerformance: [false],
        standUpComedy: [false],
        burlesque: [false],
        musicLiveBand: [false],
        musicDJ: [false],
        theater: [false],
        dance: [false],
        poetrySpokenWord: [false],
        cabaret: [false],
        other: [false]
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
    if (this.performerForm.invalid) {
      this.performerForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      // Upload image if selected
      let profileImageUrl = '';
      if (this.selectedImage) {
        profileImageUrl = await this.storageService.uploadImage(
          this.selectedImage,
          'performers'
        );
      }

      // Get selected performance types
      const performanceTypesGroup = this.performerForm.get('performanceTypes')?.value;
      const selectedPerformanceTypes = Object.keys(performanceTypesGroup)
        .filter(key => performanceTypesGroup[key])
        .map(key => this.convertCamelToReadable(key));

      // Prepare performer data
      const performerData: Performer = {
        name: this.performerForm.value.name,
        pronouns: this.performerForm.value.pronouns,
        bio: this.performerForm.value.bio,
        email: this.performerForm.value.email,
        phone: this.performerForm.value.phone,
        website: this.performerForm.value.website,
        socialMedia: {
          instagram: this.performerForm.value.instagram,
          facebook: this.performerForm.value.facebook,
          twitter: this.performerForm.value.twitter,
          tiktok: this.performerForm.value.tiktok
        },
        performanceTypes: selectedPerformanceTypes,
        profileImageUrl: profileImageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Firestore
      const performersCollection = collection(this.firestore, 'performers');
      await addDoc(performersCollection, performerData);

      this.submitSuccess = true;
      this.performerForm.reset();
      this.selectedImage = null;
      this.imagePreview = null;

      // Reset success message after 3 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 3000);

    } catch (error) {
      console.error('Error submitting performer profile:', error);
      this.errorMessage = 'An error occurred while submitting your profile. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private convertCamelToReadable(camelCase: string): string {
    const result = camelCase.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
