export interface Performer {
  id?: string;
  name: string;
  pronouns?: string;
  bio: string;
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
  performanceTypes: string[];
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
