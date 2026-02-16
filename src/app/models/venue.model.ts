export interface Venue {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  email: string;
  phone: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  capacity?: number;
  amenities?: string[];
  accessibility?: string;
  venueImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
