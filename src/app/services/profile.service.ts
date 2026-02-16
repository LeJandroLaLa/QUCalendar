import { Injectable } from '@angular/core';
import {
  ProfileBase,
  ProfileType,
  EventProfile,
  VenueProfile,
  VenueType,
  ArtistProfile,
} from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // ==========================================
  // VENUES
  // ==========================================
  private venues: VenueProfile[] = [];

  // ==========================================
  // ARTISTS
  // ==========================================
  private artists: ArtistProfile[] = [];

  // ==========================================
  // EVENTS
  // ==========================================
  private events: EventProfile[] = [];

  // ==========================================
  // PUBLIC API
  // ==========================================

  getAllEvents(): EventProfile[] {
    return this.events;
  }

  getUpcomingEvents(): EventProfile[] {
    const today = new Date().toISOString().split('T')[0];
    return this.events
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  getPastEvents(): EventProfile[] {
    const today = new Date().toISOString().split('T')[0];
    return this.events
      .filter((e) => e.date < today)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  getAllVenues(): VenueProfile[] {
    return this.venues;
  }

  getAllArtists(): ArtistProfile[] {
    return this.artists;
  }

  getEventById(id: string): EventProfile | undefined {
    return this.events.find((e) => e.id === id);
  }

  getVenueById(id: string): VenueProfile | undefined {
    return this.venues.find((v) => v.id === id);
  }

  getArtistById(id: string): ArtistProfile | undefined {
    return this.artists.find((a) => a.id === id);
  }

  getProfileByTypeAndId(
    type: string,
    id: string
  ): EventProfile | VenueProfile | ArtistProfile | undefined {
    switch (type) {
      case 'events':
        return this.getEventById(id);
      case 'venues':
        return this.getVenueById(id);
      case 'artists':
        return this.getArtistById(id);
      default:
        return undefined;
    }
  }

  getEventsByIds(ids: string[]): EventProfile[] {
    return ids
      .map((id) => this.getEventById(id))
      .filter((e): e is EventProfile => !!e);
  }

  getEventsByVenue(venueId: string): EventProfile[] {
    return this.events.filter((e) => e.venueId === venueId);
  }

  getEventsByArtist(artistId: string): EventProfile[] {
    return this.events.filter((e) => e.artistIds.includes(artistId));
  }

  getEventsByCategory(category: string): EventProfile[] {
    return this.events.filter((e) => e.category.includes(category));
  }

  getEventsByDateRange(startDate: string, endDate: string): EventProfile[] {
    return this.events.filter(
      (e) => e.date >= startDate && e.date <= endDate
    );
  }

  getVenuesByType(venueType: VenueType): VenueProfile[] {
    return this.venues.filter((v) => v.venueType === venueType);
  }

  searchVenues(query: string): VenueProfile[] {
    const q = query.toLowerCase();
    return this.venues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.state.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.venueType.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  searchEvents(query: string): EventProfile[] {
    const q = query.toLowerCase();
    return this.events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.category.some((c) => c.toLowerCase().includes(q))
    );
  }
}
