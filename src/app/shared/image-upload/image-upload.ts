import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUploadComponent {
  @Input() folder: string = 'general';
  @Input() label: string = 'Image';
  @Input() currentUrl: string = '';
  @Output() imageUrlChange = new EventEmitter<string>();

  urlInput = signal('');
  uploadMode = signal<'url' | 'file'>('file');
  uploading = signal(false);
  uploadProgress = signal(0);
  error = signal('');
  preview = signal('');

  constructor(private imageUploadService: ImageUploadService) {}

  setMode(mode: 'url' | 'file'): void {
    this.uploadMode.set(mode);
    this.error.set('');
  }

  onUrlInput(value: string): void {
    this.urlInput.set(value);
    this.error.set('');
    if (value.trim()) {
      this.preview.set(value.trim());
      this.imageUrlChange.emit(value.trim());
    } else {
      this.preview.set('');
      this.imageUrlChange.emit('');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error.set('');
    this.uploading.set(true);
    this.uploadProgress.set(0);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      this.preview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    this.imageUploadService.uploadImage(file, this.folder).subscribe(result => {
      if (result.error) {
        this.error.set(result.error);
        this.uploading.set(false);
        this.preview.set('');
        return;
      }

      this.uploadProgress.set(result.progress);

      if (result.downloadUrl) {
        this.uploading.set(false);
        this.imageUrlChange.emit(result.downloadUrl);
      }
    });
  }

  clearImage(): void {
    this.preview.set('');
    this.urlInput.set('');
    this.uploadProgress.set(0);
    this.error.set('');
    this.imageUrlChange.emit('');
  }
}