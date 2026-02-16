import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { VenuesComponent } from './venues/venues';
import { ProfileComponent } from './profile/profile';
import { PerformerForm } from './components/performer-form/performer-form';
import { VenueForm } from './components/venue-form/venue-form';
import { EventForm } from './components/event-form/event-form';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'profile/:type/:id', component: ProfileComponent },
  { path: 'add-performer', component: PerformerForm },
  { path: 'add-venue', component: VenueForm },
  { path: 'add-event', component: EventForm },
  { path: '**', redirectTo: '' }
];
