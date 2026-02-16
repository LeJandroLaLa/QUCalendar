export interface Event {
  id?: string;
  title: string;
  description: string;
  eventType: string;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  endTime?: string;
  venueId: string;
  venueName?: string;
  performerIds: string[];
  performerNames?: string[];
  ticketPrice?: string;
  ticketUrl?: string;
  eventImageUrl?: string;
  tags?: string[];
  ageRestriction?: string;
  accessibility?: string;
  contactEmail?: string;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}
