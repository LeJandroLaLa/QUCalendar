import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { VenuesComponent } from './venues/venues';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'profile/:type/:id', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
