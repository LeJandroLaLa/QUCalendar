import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  currentStardate: string = '';

  ngOnInit() {
    this.updateStardate();
    setInterval(() => this.updateStardate(), 3600000);
  }

  updateStardate() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000) + 1;
    const fractional = (dayOfYear / 365 * 100).toFixed(1);
    this.currentStardate = `${year.toString().substring(1)}${fractional}`;
  }
}