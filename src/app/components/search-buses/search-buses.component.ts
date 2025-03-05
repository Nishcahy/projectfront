import { Component } from '@angular/core';
import { IBus } from '../../model/interface/myReservation';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-buses',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-buses.component.html',
  styleUrl: './search-buses.component.css',
})
export class SearchBusesComponent {
  fromDestination: string = '';
  toDestination: string = '';
  buses: IBus[] = [];
  loading: boolean = false;
  error: string | null = null;
  noBusesAvailable: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  searchBuses(): void {
    this.loading = true;
    this.error = null;
    this.buses = [];
    this.noBusesAvailable = false;

    if (!this.fromDestination || !this.toDestination) {
      this.error = 'Please enter both From and To destinations.';
      this.loading = false;
      return;
    }

    if (this.fromDestination===this.toDestination) {
      this.error = 'From and To Destination cannot be Same.';
      this.loading = false;
      return;
    }
    
    const encodedFrom = encodeURIComponent(this.fromDestination);
    const encodedTo = encodeURIComponent(this.toDestination);

    const url = `http://localhost:8082/api/reservations/${encodedFrom}/${encodedTo}`;

    this.http.get<IBus[]>(url).subscribe(
      (data) => {
        if (data.length === 1 && data[0].busNo === "Bus Not Available") {
          this.noBusesAvailable = true;
        } else {
          this.buses = data;
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === 400) {
          this.error = 'Invalid route. Please check your destinations.';
        } else if (error.status === 503) {
          this.error = 'Service unavailable. Please try again later.';
        } else {
          this.error = 'Failed to load bus data.';
        }
        console.error('API Error:', error);
      }
    );
  }

  openBooking(bus: IBus): void {
    this.router.navigate(['/booking', bus.busId]);
  }
}