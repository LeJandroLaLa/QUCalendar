import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor(private storage: Storage) {}

  uploadImage(file: File, folder: string, fileName?: string): Observable<UploadProgress> {
    return new Observable(observer => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        observer.next({ progress: 0, error: 'File must be an image.' });
        observer.complete();
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        observer.next({ progress: 0, error: 'Image must be under 10MB.' });
        observer.complete();
        return;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeName = fileName
        ? `${fileName}_${timestamp}`
        : `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      const storageRef = ref(this.storage, `submissions/${folder}/${safeName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          observer.next({ progress });
        },
        error => {
          console.error('Upload error:', error);
          observer.next({ progress: 0, error: 'Upload failed. Please try again.' });
          observer.complete();
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          observer.next({ progress: 100, downloadUrl });
          observer.complete();
        }
      );
    });
  }

  // Validate and return a usable image URL (for URL input option)
  isValidImageUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' &&
             (url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) !== null ||
              url.includes('firebasestorage') ||
              url.includes('cloudinary') ||
              url.includes('imgur') ||
              url.includes('instagram'));
    } catch {
      return false;
    }
  }
}