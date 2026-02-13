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
  private venues: VenueProfile[] = [
    {
      id: 'venue-below-zero',
      type: 'venue',
      venueType: 'Night Club',
      name: 'Below Zero Lounge',
      tagline:
        "Cincinnati's premier LGBTQ+ nightlife destination since 2008. Three floors of music, dancing, and community.",
      description:
        "Below Zero Lounge has been a cornerstone of Cincinnati's LGBTQ+ community for over 15 years. With three distinct floors — the main dance floor, an intimate piano bar, and a rooftop patio — there's something for everyone. We host weekly drag shows, karaoke nights, and special events throughout the year. All are welcome.",
      avatarEmoji: '🏳️‍🌈',
      tags: ['Bar / Club', 'Nightlife', 'Drag Shows', 'Live Music'],
      socialLinks: [
        { platform: 'Website', icon: '🌐', url: 'https://example.com' },
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
        { platform: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
      ],
      contactEmail: 'info@belowzerolounge.com',
      contactPhone: '(513) 555-0142',
      website: 'https://belowzerolounge.com',
      address: '1120 Walnut St',
      city: 'Cincinnati',
      state: 'OH',
      zip: '45202',
      isAccessible: true,
      parking: 'Street parking, garage 1 block east',
      transit: 'Metro Stop: Walnut & 12th',
      capacity: 350,
      features: [
        { icon: '🍹', label: 'Full Bar' },
        { icon: '🍕', label: 'Food Menu' },
        { icon: '🎵', label: 'Sound System' },
        { icon: '💡', label: 'Stage Lighting' },
        { icon: '🌿', label: 'Rooftop Patio' },
      ],
      hours: [
        { day: 'Monday', time: 'Closed' },
        { day: 'Tuesday', time: 'Closed' },
        { day: 'Wednesday', time: '5:00 PM — 12:00 AM' },
        { day: 'Thursday', time: '5:00 PM — 1:00 AM' },
        { day: 'Friday', time: '5:00 PM — 2:30 AM' },
        { day: 'Saturday', time: '5:00 PM — 2:30 AM' },
        { day: 'Sunday', time: '12:00 PM — 10:00 PM' },
      ],
      bookingUrl: '#',
      upcomingEventIds: ['event-neon-nights', 'event-karaoke-queens'],
      pastEventIds: ['event-disco-throwback', 'event-fundraiser-gala'],
    },
    {
      id: 'venue-the-dock',
      type: 'venue',
      venueType: 'Bar',
      name: 'The Dock',
      tagline:
        'A cozy neighborhood bar in Covington with weekly events, trivia, and the best patio on the river.',
      description:
        "The Dock is Northern Kentucky's favorite LGBTQ+-friendly hangout. With a relaxed atmosphere, riverfront patio, and a packed events calendar, it's the perfect spot for everything from Sunday brunch to Saturday night dancing. Dog-friendly patio!",
      avatarEmoji: '⚓',
      tags: ['Bar', 'Patio', 'Brunch', 'Trivia'],
      socialLinks: [
        { platform: 'Website', icon: '🌐', url: 'https://example.com' },
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
      ],
      contactEmail: 'hello@thedocknky.com',
      contactPhone: '(859) 555-0233',
      website: 'https://thedocknky.com',
      address: '420 Riverside Dr',
      city: 'Covington',
      state: 'KY',
      zip: '41011',
      isAccessible: true,
      parking: 'Free lot behind building',
      transit: 'TANK Bus Route 1',
      capacity: 150,
      features: [
        { icon: '🍹', label: 'Full Bar' },
        { icon: '🥞', label: 'Brunch Menu' },
        { icon: '🌿', label: 'Riverfront Patio' },
        { icon: '🐕', label: 'Dog Friendly' },
      ],
      hours: [
        { day: 'Monday', time: 'Closed' },
        { day: 'Tuesday', time: '4:00 PM — 11:00 PM' },
        { day: 'Wednesday', time: '4:00 PM — 11:00 PM' },
        { day: 'Thursday', time: '4:00 PM — 12:00 AM' },
        { day: 'Friday', time: '4:00 PM — 2:00 AM' },
        { day: 'Saturday', time: '11:00 AM — 2:00 AM' },
        { day: 'Sunday', time: '10:00 AM — 9:00 PM' },
      ],
      upcomingEventIds: ['event-comedy-hour'],
      pastEventIds: ['event-drag-bingo'],
    },
    {
      id: 'venue-woodward',
      type: 'venue',
      venueType: 'Theatre',
      name: 'Woodward Theater',
      tagline:
        'A historic OTR theater hosting live music, drag spectaculars, and community events in a stunning restored space.',
      description:
        'The Woodward Theater is a beautifully restored venue in Over-the-Rhine offering a versatile space for concerts, drag shows, film screenings, and private events. With state-of-the-art sound and lighting, it\'s one of Cincinnati\'s premier performance spaces.',
      avatarEmoji: '🎭',
      tags: ['Theater', 'Live Music', 'Drag', 'Art'],
      socialLinks: [
        { platform: 'Website', icon: '🌐', url: 'https://example.com' },
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
      ],
      contactEmail: 'events@woodwardtheater.com',
      contactPhone: '(513) 555-0301',
      website: 'https://woodwardtheater.com',
      address: '1404 Main St',
      city: 'Cincinnati',
      state: 'OH',
      zip: '45202',
      isAccessible: true,
      parking: 'Metered street parking, OTR garage nearby',
      transit: 'Metro Stop: Main & 14th',
      capacity: 500,
      features: [
        { icon: '🍹', label: 'Full Bar' },
        { icon: '🎵', label: 'Pro Sound System' },
        { icon: '💡', label: 'Stage Lighting' },
        { icon: '🎬', label: 'Film Screenings' },
        { icon: '🪑', label: 'Balcony Seating' },
      ],
      hours: [
        { day: 'Monday', time: 'Closed' },
        { day: 'Tuesday', time: 'Closed' },
        { day: 'Wednesday', time: 'Event Nights Only' },
        { day: 'Thursday', time: 'Event Nights Only' },
        { day: 'Friday', time: '6:00 PM — 2:00 AM' },
        { day: 'Saturday', time: '6:00 PM — 2:00 AM' },
        { day: 'Sunday', time: 'Event Nights Only' },
      ],
      upcomingEventIds: [],
      pastEventIds: ['event-drag-bingo'],
    },
  ];

  // ==========================================
  // ARTISTS
  // ==========================================
  private artists: ArtistProfile[] = [
    {
      id: 'artist-anita-cocktail',
      type: 'artist',
      name: 'Anita Cocktail',
      tagline:
        "Cincinnati's reigning queen of comedy drag. Serving looks, laughs, and lip syncs since 2015.",
      description:
        "Anita Cocktail has been a staple of the Cincinnati drag scene for over a decade. Known for her razor-sharp wit, jaw-dropping reveals, and legendary lip syncs, she's hosted everything from intimate bar shows to Pride main stages. When she's not in a wig, she's mentoring the next generation of drag performers through the Cincinnati Drag Workshop program.",
      avatarEmoji: '💃',
      tags: ['Drag Queen', 'Comedy', 'Lip Sync', 'Host / MC'],
      socialLinks: [
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
        { platform: 'TikTok', icon: '🎵', url: 'https://tiktok.com' },
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
      ],
      contactEmail: 'booking@anitacocktail.com',
      contactPhone: '(513) 555-0177',
      performanceTypes: [
        { icon: '💃', label: 'Drag Show' },
        { icon: '🎤', label: 'Hosting / MC' },
        { icon: '😂', label: 'Comedy Set' },
        { icon: '👗', label: 'Fashion Show' },
      ],
      basedIn: 'Cincinnati, OH',
      willTravel: true,
      bookingEmail: 'booking@anitacocktail.com',
      bookingPhone: '(513) 555-0177',
      ratesInfo: 'Rates available upon request',
      upcomingEventIds: ['event-neon-nights', 'event-comedy-hour'],
      pastEventIds: ['event-drag-bingo', 'event-spring-brunch'],
    },
    {
      id: 'artist-dj-prism',
      type: 'artist',
      name: 'DJ Prism',
      tagline:
        'High-energy DJ blending house, pop remixes, and queer anthems. Resident at Below Zero and touring the Midwest.',
      description:
        'DJ Prism has been lighting up dance floors across the Midwest for 8 years. Specializing in high-energy house music with seamless pop remixes and queer anthem mashups, every set is designed to keep you moving. From intimate club nights to Pride main stages, Prism brings the energy.',
      avatarEmoji: '🎧',
      tags: ['DJ', 'House', 'Pop Remix', 'Dance'],
      socialLinks: [
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
        { platform: 'SoundCloud', icon: '🎵', url: 'https://soundcloud.com' },
        { platform: 'Website', icon: '🌐', url: 'https://example.com' },
      ],
      contactEmail: 'bookings@djprism.com',
      performanceTypes: [
        { icon: '🎧', label: 'DJ Set' },
        { icon: '🎵', label: 'Live Remix' },
        { icon: '🎤', label: 'MC / Hype' },
      ],
      basedIn: 'Cincinnati, OH',
      willTravel: true,
      bookingEmail: 'bookings@djprism.com',
      ratesInfo: 'Starting at $300 per set',
      upcomingEventIds: ['event-neon-nights'],
      pastEventIds: ['event-disco-throwback'],
    },
    {
      id: 'artist-velvet-revue',
      type: 'artist',
      name: 'The Velvet Underground Revue',
      tagline:
        'A rotating cast of drag kings, queens, and burlesque performers bringing theatrical spectacle to every stage.',
      description:
        'The Velvet Underground Revue is a performance collective featuring Cincinnati\'s most talented drag artists and burlesque performers. Each show is a fully-produced theatrical experience with original choreography, live vocals, and stunning costumes. The troupe has performed at Pride events, fundraisers, and festivals across Ohio and Kentucky.',
      avatarEmoji: '🎭',
      tags: ['Drag Troupe', 'Burlesque', 'Theatrical', 'Live Vocals'],
      socialLinks: [
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
      ],
      contactEmail: 'velvetrevue@gmail.com',
      contactPhone: '(513) 555-0288',
      performanceTypes: [
        { icon: '💃', label: 'Drag Show' },
        { icon: '🎭', label: 'Burlesque' },
        { icon: '🎤', label: 'Live Vocals' },
        { icon: '👗', label: 'Fashion / Costume' },
      ],
      basedIn: 'Cincinnati, OH',
      willTravel: true,
      bookingEmail: 'velvetrevue@gmail.com',
      bookingPhone: '(513) 555-0288',
      ratesInfo: 'Varies by show size — contact for quote',
      upcomingEventIds: ['event-neon-nights'],
      pastEventIds: ['event-fundraiser-gala'],
    },
  ];

  // ==========================================
  // EVENTS
  // ==========================================
  private events: EventProfile[] = [
    {
      id: 'event-neon-nights',
      type: 'event',
      name: 'Neon Nights: Pride Kickoff Party',
      tagline:
        'The biggest queer dance party in the tri-state, kicking off Pride Month with DJs, drag, and dazzle.',
      description:
        "Join us for the most anticipated queer event of the summer! Neon Nights returns for its 5th year, featuring three stages of music, a drag showcase by Cincinnati's finest queens and kings, and a rooftop lounge with skyline views. All proceeds benefit the Greater Cincinnati LGBTQ+ Community Fund. Dress code: neon, glitter, or your most fabulous self.",
      avatarEmoji: '🌟',
      tags: ['Nightlife', 'DJ Sets', 'Drag', '21+'],
      socialLinks: [
        { platform: 'Website', icon: '🌐', url: 'https://example.com' },
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
      ],
      contactEmail: 'events@neonnightscincy.org',
      contactPhone: '(513) 555-0199',
      date: '2026-06-14',
      startTime: '9:00 PM',
      endTime: '2:00 AM',
      dayOfWeek: 'Saturday',
      fullDate: 'June 14, 2026',
      month: 'JUN',
      dayNumber: 14,
      price: '$15',
      category: ['Nightlife', 'DJ Sets', 'Drag'],
      venueId: 'venue-below-zero',
      venueName: 'Below Zero Lounge',
      venueAddress: '1120 Walnut St, Cincinnati, OH 45202',
      artistIds: [
        'artist-dj-prism',
        'artist-anita-cocktail',
        'artist-velvet-revue',
      ],
      artistNames: [
        'DJ Prism',
        'Anita Cocktail',
        'The Velvet Underground Revue',
      ],
      isAccessible: true,
      ticketUrl: '#',
    },
    {
      id: 'event-karaoke-queens',
      type: 'event',
      name: 'Karaoke Queens Night',
      tagline:
        'Grab the mic and belt it out! Hosted karaoke with drink specials and a rotating cast of drag hostesses.',
      description:
        "Every Friday it's Karaoke Queens Night at Below Zero! Our rotating cast of drag hostesses keep the energy high while you take the stage. Drink specials all night, plus a best performance prize each week. No cover, no judgment, just fun.",
      avatarEmoji: '🎤',
      tags: ['Karaoke', 'Nightlife', 'Drag', 'Free'],
      socialLinks: [
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
      ],
      contactEmail: 'info@belowzerolounge.com',
      date: '2026-06-20',
      startTime: '8:00 PM',
      endTime: '1:00 AM',
      dayOfWeek: 'Friday',
      fullDate: 'June 20, 2026',
      month: 'JUN',
      dayNumber: 20,
      price: 'Free',
      category: ['Karaoke', 'Nightlife', 'Drag'],
      venueId: 'venue-below-zero',
      venueName: 'Below Zero Lounge',
      venueAddress: '1120 Walnut St, Cincinnati, OH 45202',
      artistIds: ['artist-anita-cocktail'],
      artistNames: ['Anita Cocktail'],
      isAccessible: true,
    },
    {
      id: 'event-comedy-hour',
      type: 'event',
      name: "Anita's Comedy Hour",
      tagline:
        'An intimate evening of stand-up, improv, and absolute chaos hosted by the one and only Anita Cocktail.',
      description:
        "Anita Cocktail takes center stage for a full hour of comedy, improv games with the audience, and surprise guest performers. It's unscripted, unhinged, and unforgettable. Two-drink minimum, but you'll want more.",
      avatarEmoji: '😂',
      tags: ['Comedy', 'Drag', 'Live Show'],
      socialLinks: [
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
      ],
      contactEmail: 'booking@anitacocktail.com',
      date: '2026-06-18',
      startTime: '8:00 PM',
      endTime: '10:00 PM',
      dayOfWeek: 'Wednesday',
      fullDate: 'June 18, 2026',
      month: 'JUN',
      dayNumber: 18,
      price: '$10',
      category: ['Live Show', 'Drag', 'Community'],
      venueId: 'venue-the-dock',
      venueName: 'The Dock',
      venueAddress: '420 Riverside Dr, Covington, KY 41011',
      artistIds: ['artist-anita-cocktail'],
      artistNames: ['Anita Cocktail'],
      isAccessible: true,
    },
    {
      id: 'event-leather-ball',
      type: 'event',
      name: 'Leather & Lace: Summer Ball',
      tagline:
        'A night of leather, lace, and liberation. Dress up or dress down — just dress to impress.',
      description:
        'The annual Leather & Lace Summer Ball returns! This themed dance party celebrates the full spectrum of queer expression. Featuring guest DJs, a costume contest with cash prizes, and a dedicated chill lounge. All gender expressions welcome.',
      avatarEmoji: '🔗',
      tags: ['Leather', 'Nightlife', 'Fashion', '21+'],
      socialLinks: [
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
      ],
      contactEmail: 'info@belowzerolounge.com',
      date: '2026-06-28',
      startTime: '10:00 PM',
      endTime: '3:00 AM',
      dayOfWeek: 'Saturday',
      fullDate: 'June 28, 2026',
      month: 'JUN',
      dayNumber: 28,
      price: '$20',
      category: ['Leather', 'Nightlife', 'Fashion'],
      venueId: 'venue-below-zero',
      venueName: 'Below Zero Lounge',
      venueAddress: '1120 Walnut St, Cincinnati, OH 45202',
      artistIds: ['artist-dj-prism'],
      artistNames: ['DJ Prism'],
      isAccessible: true,
    },
    {
      id: 'event-pride-brunch',
      type: 'event',
      name: 'Rainbow Brunch: Pride Edition',
      tagline:
        'Mimosas, music, and morning drag — the perfect way to start your Pride weekend.',
      description:
        'Start your Pride weekend right with Rainbow Brunch! Enjoy a full brunch menu with bottomless mimosas while our drag brunch hosts keep the party going. Family-friendly until noon, then 21+ after. Reservations recommended.',
      avatarEmoji: '🥞',
      tags: ['Brunch', 'Drag', 'Community', 'Family Friendly'],
      socialLinks: [
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
      ],
      contactEmail: 'hello@thedocknky.com',
      date: '2026-06-14',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      dayOfWeek: 'Saturday',
      fullDate: 'June 14, 2026',
      month: 'JUN',
      dayNumber: 14,
      price: '$25',
      category: ['Brunch', 'Drag', 'Community'],
      venueId: 'venue-the-dock',
      venueName: 'The Dock',
      venueAddress: '420 Riverside Dr, Covington, KY 41011',
      artistIds: ['artist-anita-cocktail'],
      artistNames: ['Anita Cocktail'],
      isAccessible: true,
    },
    {
      id: 'event-outdoor-hike',
      type: 'event',
      name: 'Queer Trails: Pride Hike',
      tagline:
        'A beginner-friendly group hike through Eden Park with picnic and community vibes.',
      description:
        'Lace up your boots and join Queer Trails for a scenic group hike through Eden Park! This beginner-friendly walk includes stops at the overlook, Krohn Conservatory, and ends with a community picnic at Mirror Lake. All ages, all abilities welcome. Bring water and sunscreen!',
      avatarEmoji: '🏞️',
      tags: ['Outdoors', 'Wellness', 'Community', 'Free', 'All Ages'],
      socialLinks: [
        { platform: 'Instagram', icon: '📸', url: 'https://instagram.com' },
        { platform: 'Facebook', icon: '📘', url: 'https://facebook.com' },
      ],
      contactEmail: 'queertrailscincy@gmail.com',
      date: '2026-06-15',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      dayOfWeek: 'Sunday',
      fullDate: 'June 15, 2026',
      month: 'JUN',
      dayNumber: 15,
      price: 'Free',
      category: ['Outdoors', 'Wellness', 'Community'],
      venueId: '',
      venueName: 'Eden Park',
      venueAddress: 'Eden Park Dr, Cincinnati, OH 45202',
      artistIds: [],
      artistNames: [],
      isAccessible: false,
    },
    // Past events
    {
      id: 'event-disco-throwback',
      type: 'event',
      name: 'Disco Inferno Throwback',
      tagline: 'A retro dance party with 70s and 80s disco classics all night long.',
      description:
        'Step back in time with Disco Inferno! Our DJs spin nothing but classic disco, funk, and early house all night. Bell bottoms and platform shoes strongly encouraged.',
      avatarEmoji: '🕺',
      tags: ['Nightlife', 'DJ Sets', 'Dance'],
      socialLinks: [],
      date: '2026-05-10',
      startTime: '9:00 PM',
      endTime: '2:00 AM',
      dayOfWeek: 'Saturday',
      fullDate: 'May 10, 2026',
      month: 'MAY',
      dayNumber: 10,
      price: '$10',
      category: ['Nightlife', 'DJ Sets'],
      venueId: 'venue-below-zero',
      venueName: 'Below Zero Lounge',
      venueAddress: '1120 Walnut St, Cincinnati, OH 45202',
      artistIds: ['artist-dj-prism'],
      artistNames: ['DJ Prism'],
      isAccessible: true,
    },
    {
      id: 'event-fundraiser-gala',
      type: 'event',
      name: 'Community Fundraiser Gala',
      tagline:
        'An elegant evening raising funds for local LGBTQ+ youth programs.',
      description:
        'The annual Community Fundraiser Gala brings together supporters, performers, and community leaders for an evening of entertainment, silent auction, and speeches. All proceeds go to LGBTQ+ youth programs in the Greater Cincinnati area.',
      avatarEmoji: '💰',
      tags: ['Fundraiser', 'Community', 'Live Show'],
      socialLinks: [],
      date: '2026-04-18',
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      dayOfWeek: 'Friday',
      fullDate: 'April 18, 2026',
      month: 'APR',
      dayNumber: 18,
      price: '$50',
      category: ['Fundraiser', 'Community'],
      venueId: 'venue-below-zero',
      venueName: 'Below Zero Lounge',
      venueAddress: '1120 Walnut St, Cincinnati, OH 45202',
      artistIds: ['artist-velvet-revue'],
      artistNames: ['The Velvet Underground Revue'],
      isAccessible: true,
    },
    {
      id: 'event-drag-bingo',
      type: 'event',
      name: 'Drag Bingo Fundraiser',
      tagline: 'Bingo with a twist — hosted by drag queens with prizes, laughs, and good cause.',
      description:
        'It\'s not your grandma\'s bingo night! Join our fabulous drag hosts for an evening of bingo, raffle prizes, and nonstop entertainment. Proceeds benefit the Cincinnati LGBTQ+ Community Center.',
      avatarEmoji: '🎱',
      tags: ['Fundraiser', 'Drag', 'Community', 'Trivia'],
      socialLinks: [],
      date: '2026-05-02',
      startTime: '9:00 PM',
      endTime: '12:00 AM',
      dayOfWeek: 'Friday',
      fullDate: 'May 2, 2026',
      month: 'MAY',
      dayNumber: 2,
      price: '$15',
      category: ['Fundraiser', 'Drag', 'Trivia'],
      venueId: 'venue-woodward',
      venueName: 'Woodward Theater',
      venueAddress: '1404 Main St, Cincinnati, OH 45202',
      artistIds: ['artist-anita-cocktail'],
      artistNames: ['Anita Cocktail'],
      isAccessible: true,
    },
    {
      id: 'event-spring-brunch',
      type: 'event',
      name: 'Spring Fling Drag Brunch',
      tagline: 'Brunch, bottomless mimosas, and spring-themed drag performances.',
      description:
        'Celebrate the season at our Spring Fling Drag Brunch! Full brunch menu with bottomless mimosas, hosted by Anita Cocktail and friends. Flower crowns encouraged.',
      avatarEmoji: '🌸',
      tags: ['Brunch', 'Drag', 'Community'],
      socialLinks: [],
      date: '2026-04-12',
      startTime: '11:00 AM',
      endTime: '3:00 PM',
      dayOfWeek: 'Saturday',
      fullDate: 'April 12, 2026',
      month: 'APR',
      dayNumber: 12,
      price: '$30',
      category: ['Brunch', 'Drag'],
      venueId: 'venue-the-dock',
      venueName: 'The Dock',
      venueAddress: '420 Riverside Dr, Covington, KY 41011',
      artistIds: ['artist-anita-cocktail'],
      artistNames: ['Anita Cocktail'],
      isAccessible: true,
    },
  ];

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
