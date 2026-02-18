export type ProfileType = 'event' | 'venue' | 'artist';

export type VenueType =
  | 'Restaurant'
  | 'Theatre'
  | 'Events Space'
  | 'Bar'
  | 'Night Club'
  | 'Park / Public Space'
  | 'Community Center'
  | 'Gallery / Museum'
  | 'Private Venue';

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
}

export interface VenueProfile {
  id: string;
  type: 'venue';
  name: string;
  tagline: string;
  description: string;
  avatarEmoji: string;
  venueType: VenueType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  venueImageUrl?: string;
  isAccessible: boolean;
  parking?: string;
  transit?: string;
  capacity: number;
  amenities: string[];
  features: { icon: string; label: string }[];
  tags: string[];
  hours: { day: string; time: string }[];
  socialLinks: SocialLink[];
  bookingUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface EventProfile {
  id: string;
  type: 'event';
  name: string;
  description: string;
  date: string;           // YYYY-MM-DD
  startTime: string;
  endTime: string;
  price: string;
  category: string[];
  venueId: string;
  venueName: string;
  venueAddress: string;
  artistIds: string[];
  artistNames: string[];
  isAccessible: boolean;
  ticketUrl?: string;
  eventImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ArtistProfile {
  id: string;
  type: 'artist';
  name: string;
  tagline: string;
  description: string;
  avatarEmoji: string;
  basedIn: string;
  willTravel: boolean;
  bookingEmail?: string;
  bookingPhone?: string;
  ratesInfo: string;
  artistImageUrl?: string;
  performanceTypes: { icon: string; label: string }[];
  tags: string[];
  socialLinks: SocialLink[];
  createdAt?: any;
  updatedAt?: any;
}