import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from '../events/events';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EventsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {}