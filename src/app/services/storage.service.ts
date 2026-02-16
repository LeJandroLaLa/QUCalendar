import { Injectable } from '@angular/core';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = storage;

  constructor() {}

  /**
   * Upload an image to Firebase Storage
   * @param file - The file to upload
   * @param path - The storage path (e.g., 'performers', 'venues', 'events')
   * @returns Promise with the download URL
   */
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const filePath = `${path}/${filename}`;

      // Create storage reference
      const storageRef = ref(this.storage, filePath);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl - The full URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}
