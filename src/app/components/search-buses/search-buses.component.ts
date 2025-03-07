import { Component } from '@angular/core';
import { IBus } from '../../model/interface/myReservation';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-buses', // Component selector
  imports: [FormsModule, CommonModule], // Imports necessary modules
  templateUrl: './search-buses.component.html', // Path to the component's HTML template
  styleUrl: './search-buses.component.css', // Path to the component's CSS styles
})
export class SearchBusesComponent {
  fromDestination: string = ''; // Stores the starting destination entered by the user
  toDestination: string = ''; // Stores the ending destination entered by the user
  buses: IBus[] = []; // Array to store the buses fetched from the API
  loading: boolean = false; // Flag to indicate if data is being loaded
  error: string | null = null; // Stores any error message to be displayed
  noBusesAvailable: boolean = false; // Flag to indicate if no buses were found

  constructor(private http: HttpClient, private router: Router) { } // Inject HttpClient and Router

  searchBuses(): void {
    this.loading = true; // Set loading flag to true
    this.error = null; // Clear any previous error messages
    this.buses = []; // Clear previous bus data
    this.noBusesAvailable = false; // Clear no buses available flag

    if (!this.fromDestination || !this.toDestination) { // Check if both destinations are entered
      this.error = 'Please enter both From and To destinations.'; // Set error message
      this.loading = false; // Set loading flag to false
      return;
    }

    if (this.fromDestination === this.toDestination) { // Check if from and to destinations are the same
      this.error = 'From and To Destination cannot be Same.'; // Set error message
      this.loading = false; // Set loading flag to false
      return;
    }

    const encodedFrom = encodeURIComponent(this.fromDestination); // Encode from destination for URL
    const encodedTo = encodeURIComponent(this.toDestination); // Encode to destination for URL

    const url = `http://localhost:8082/api/reservations/${encodedFrom}/${encodedTo}`; // Construct the API URL

    this.http.get<IBus[]>(url).subscribe( // Make an HTTP GET request to the API
      (data) => {
        if (data.length === 1 && data[0].busNo === "Bus Not Available") { // Check if no buses are available
          this.noBusesAvailable = true; // Set no buses available flag to true
        } else {
          this.buses = data; // Store the fetched buses
        }
        this.loading = false; // Set loading flag to false
      },
      (error) => {
        this.loading = false; // Set loading flag to false
        if (error.status === 400) { // Check for 400 error (invalid route)
          this.error = 'Invalid route. Please check your destinations.'; // Set error message
        } else if (error.status === 503) { // Check for 503 error (service unavailable)
          this.error = 'Service unavailable. Please try again later.'; // Set error message
        } else {
          this.error = 'Failed to load bus data.'; // Set generic error message
        }
        console.error('API Error:', error); // Log the error to the console
      }
    );
  }

  openBooking(bus: IBus): void {
    this.router.navigate(['/booking', bus.busId]); // Navigate to the booking page with the bus ID
  }
}