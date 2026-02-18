import { SubmitEventComponent } from './submit-event/submit-event';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { VenuesComponent } from './venues/venues';
import { ProfileComponent } from './profile/profile';
import { SubmitVenueComponent } from './submit-venue/submit-venue';
import { SubmitArtistComponent } from './submit-artist/submit-artist';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'profile/:type/:id', component: ProfileComponent },
  { path: 'submit/venue', component: SubmitVenueComponent },
  { path: 'submit/artist', component: SubmitArtistComponent },
  { path: 'submit/event', component: SubmitEventComponent },
  { path: '**', redirectTo: '' }
];