export type ProfileType = 'event' | 'venue' | 'artist';

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
}

export interface ProfileBase {
  id: string;
  type: ProfileType;
  name: string;
  tagline: string;
  description: string;
  bannerImage?: string;
  avatarImage?: string;
  avatarEmoji: string;
  tags: string[];
  socialLinks: SocialLink[];
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export interface EventProfile extends ProfileBase {
  type: 'event';
  date: string;           // ISO date string
  startTime: string;      // e.g. "9:00 PM"
  endTime: string;        // e.g. "2:00 AM"
  dayOfWeek: string;      // e.g. "Saturday"
  fullDate: string;       // e.g. "June 14, 2026"
  month: string;          // e.g. "JUN"
  dayNumber: number;      // e.g. 14
  price: string;          // e.g. "$15" or "Free"
  category: string[];     // matches filter categories
  venueId: string;        // reference to venue
  venueName: string;
  venueAddress: string;
  artistIds: string[];    // references to artists
  artistNames: string[];
  isAccessible: boolean;
  ticketUrl?: string;
}

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

export interface VenueProfile extends ProfileBase {
  type: 'venue';
  venueType: VenueType;
  address: string;
  city: string;
  state: string;
  zip: string;
  isAccessible: boolean;
  parking: string;
  transit: string;
  capacity: number;
  features: { icon: string; label: string }[];
  hours: { day: string; time: string }[];
  bookingUrl?: string;
  upcomingEventIds: string[];
  pastEventIds: string[];
}

export interface ArtistProfile extends ProfileBase {
  type: 'artist';
  performanceTypes: { icon: string; label: string }[];
  basedIn: string;
  willTravel: boolean;
  bookingEmail?: string;
  bookingPhone?: string;
  ratesInfo: string;
  upcomingEventIds: string[];
  pastEventIds: string[];
}
