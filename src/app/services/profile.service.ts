import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  EventProfile,
  VenueProfile,
  ArtistProfile,
} from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private firestore: Firestore) {}

  // ==========================================
  // EVENTS
  // ==========================================

  getAllEvents(): Observable<EventProfile[]> {
    const ref = collection(this.firestore, 'events');
    const q = query(ref, orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data.map((d) => ({ ...d, type: 'event' } as EventProfile))),
      catchError((err) => {
        console.error('Error fetching events:', err);
        return of([]);
      })
    );
  }

  getUpcomingEvents(): Observable<EventProfile[]> {
    const today = new Date().toISOString().split('T')[0];
    const ref = collection(this.firestore, 'events');
    const q = query(ref, where('date', '>=', today), orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data.map((d) => ({ ...d, type: 'event' } as EventProfile))),
      catchError((err) => {
        console.error('Error fetching upcoming events:', err);
        return of([]);
      })
    );
  }

  getPastEvents(): Observable<EventProfile[]> {
    const today = new Date().toISOString().split('T')[0];
    const ref = collection(this.firestore, 'events');
    const q = query(ref, where('date', '<', today), orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data.map((d) => ({ ...d, type: 'event' } as EventProfile))),
      catchError((err) => {
        console.error('Error fetching past events:', err);
        return of([]);
      })
    );
  }

  getEventById(id: string): Observable<EventProfile | undefined> {
    const ref = doc(this.firestore, 'events', id);
    return docData(ref, { idField: 'id' }).pipe(
      map((d) => (d ? ({ ...d, type: 'event' } as EventProfile) : undefined)),
      catchError((err) => {
        console.error('Error fetching event:', err);
        return of(undefined);
      })
    );
  }

  getEventsByVenue(venueId: string): Observable<EventProfile[]> {
    const ref = collection(this.firestore, 'events');
    const q = query(ref, where('venueId', '==', venueId), orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data.map((d) => ({ ...d, type: 'event' } as EventProfile))),
      catchError((err) => {
        console.error('Error fetching events by venue:', err);
        return of([]);
      })
    );
  }

  getEventsByArtist(artistId: string): Observable<EventProfile[]> {
    const ref = collection(this.firestore, 'events');
    const q = query(
      ref,
      where('artistIds', 'array-contains', artistId),
      orderBy('date', 'asc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data.map((d) => ({ ...d, type: 'event' } as EventProfile))),
      catchError((err) => {
        console.error('Error fetching events by artist:', err);
        return of([]);
      })
    );
  }

  getEventsByCategory(category: string): Observable<EventProfile[]> {
    const ref = collection(this.firestore, 'events');
    const q = query(
      ref,
      where('category', 'array-contains', category),
      orderBy('date', 'asc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data.map((d) => ({ ...d, type: 'event' } as EventProfile))),
      catchError((err) => {
        console.error('Error fetching events by category:', err);
        return of([]);
      })
    );
  }

  // ==========================================
  // VENUES
  // ==========================================

  getAllVenues(): Observable<VenueProfile[]> {
    const ref = collection(this.firestore, 'venues');
    const q = query(ref, orderBy('name', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) =>
        data.map((d) => ({ ...d, type: 'venue' } as VenueProfile))
      ),
      catchError((err) => {
        console.error('Error fetching venues:', err);
        return of([]);
      })
    );
  }

  getVenueById(id: string): Observable<VenueProfile | undefined> {
    const ref = doc(this.firestore, 'venues', id);
    return docData(ref, { idField: 'id' }).pipe(
      map((d) => (d ? ({ ...d, type: 'venue' } as VenueProfile) : undefined)),
      catchError((err) => {
        console.error('Error fetching venue:', err);
        return of(undefined);
      })
    );
  }

  // ==========================================
  // ARTISTS
  // ==========================================

  getAllArtists(): Observable<ArtistProfile[]> {
    const ref = collection(this.firestore, 'artists');
    const q = query(ref, orderBy('name', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((data) =>
        data.map((d) => ({ ...d, type: 'artist' } as ArtistProfile))
      ),
      catchError((err) => {
        console.error('Error fetching artists:', err);
        return of([]);
      })
    );
  }

  getArtistById(id: string): Observable<ArtistProfile | undefined> {
    const ref = doc(this.firestore, 'artists', id);
    return docData(ref, { idField: 'id' }).pipe(
      map((d) =>
        d ? ({ ...d, type: 'artist' } as ArtistProfile) : undefined
      ),
      catchError((err) => {
        console.error('Error fetching artist:', err);
        return of(undefined);
      })
    );
  }

  // ==========================================
  // COMBINED LOOKUP
  // ==========================================

  getProfileByTypeAndId(
    type: string,
    id: string
  ): Observable<EventProfile | VenueProfile | ArtistProfile | undefined> {
    switch (type) {
      case 'events':
        return this.getEventById(id);
      case 'venues':
        return this.getVenueById(id);
      case 'artists':
        return this.getArtistById(id);
      default:
        return of(undefined);
    }
  }
}