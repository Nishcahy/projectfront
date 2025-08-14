import { Component, OnInit } from '@angular/core';
import { IBus } from '../../model/interface/myReservation';
import { BusService } from '../../services/bus.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus-list',
  imports: [FormsModule, CommonModule, CurrencyPipe, UpperCasePipe],
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.css'
})

export class BusListComponent implements OnInit {

  buses: IBus[] = []; // Array to store the list of buses
  searchTerm = ''; // Variable to store the search term

  constructor(private busService: BusService, private router: Router) { } // Inject BusService and Router

  ngOnInit() {
    this.loadAllBuses(); // Load all buses when the component initializes
  }

  loadAllBuses() {
    this.busService.getAllBuses().subscribe(
      (buses) => {
        this.buses = buses; // Assign the fetched buses to the local array
      },
      (error) => {
        alert(error.error.msg); 
        console.error('Error loading buses:', error); // Log any errors that occur
      }
    );
  }

  searchBuses() {
    if (this.searchTerm) {
      // If a search term is provided, search for buses
      this.busService.searchBuses(this.searchTerm).subscribe(
        (buses) => {
          this.buses = buses; // Assign the search results to the local array
        },
        (error) => {
          alert(error.error.msg); 
          console.error('Error searching buses:', error); // Log any errors that occur during the search
        }
      );
    } else {
      // If no search term is provided, load all buses
      this.loadAllBuses();
    }
  }

  editBus(busId: number) {
    this.router.navigate(['/edit-bus', busId]); // Navigate to the edit bus page with the bus ID
  }

  deleteBus(busId: number) {
    this.busService.deleteBus(busId).subscribe(
      () => {
        console.log('Bus deleted:', busId); // Log the successful deletion
        if (this.searchTerm) {
          // If a search term was used, refresh the search results
          this.searchBuses();
        } else {
          // Otherwise, reload all buses
          this.loadAllBuses();
        }
      },
      (error) => {
        console.error('Error deleting bus:', error); // Log any errors that occur during deletion
        alert(error.error.msg); // Display an alert with the error message from the server

      }
    );
  }
}