import { CommonModule } from '@angular/common'; // Imports Angular's common modules (e.g., ngIf, ngFor)
import { Component, OnInit } from '@angular/core'; // Imports Component and OnInit from Angular core
import { FormsModule } from '@angular/forms'; // Imports FormsModule for template-driven forms
import { IBus } from '../../model/interface/myReservation'; // Imports the IBus interface
import { BusService } from '../../services/bus.service'; // Imports the BusService for API calls
import { ActivatedRoute, Router } from '@angular/router'; // Imports ActivatedRoute to get route parameters and Router for navigation

@Component({
  selector: 'app-add-bus', // Component selector
  imports: [FormsModule, CommonModule], // Imports modules used in the template
  templateUrl: './add-bus.component.html', // Path to the component's HTML template
  styleUrl: './add-bus.component.css' // Path to the component's CSS styles
})
export class AddBUsComponent implements OnInit { // Declares the component class and implements OnInit

  // Initializes the 'bus' object with default values, excluding 'busId' and 'bookedSeatNumbers'
  bus: Omit<IBus, 'busId' | 'bookedSeatNumbers'> = {
    busNo: '',
    routeFrom: '',
    routeTo: '',
    seats: 0,
    availableSeats: 0,
    departureTime: '',
    price: 0
  };

  busAddedSuccessfully = false; // Flag to indicate successful bus creation or update
  isEditMode = false; // Flag to indicate if the component is in edit mode
  busId: number | null = null; // Stores the bus ID for editing

  // Constructor: Injects BusService, ActivatedRoute, and Router
  constructor(private busService: BusService, private route: ActivatedRoute, private router: Router) { }

  // ngOnInit: Lifecycle hook called after the component is initialized
  ngOnInit() {
    // Subscribes to route parameters to check for an 'id' parameter (edit mode)
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true; // Sets edit mode to true
        this.busId = +params['id']; // Parses the 'id' parameter as a number
        this.loadBusDetails(this.busId); // Loads bus details for editing
      }
    });
  }

  // loadBusDetails: Fetches bus details by ID from the BusService
  loadBusDetails(id: number) {
    this.busService.getBusById(id).subscribe(
      (bus) => {
        // Populates the 'bus' object with the fetched bus details
        this.bus = {
          busNo: bus.busNo,
          routeFrom: bus.routeFrom,
          routeTo: bus.routeTo,
          seats: bus.seats,
          availableSeats: bus.availableSeats,
          departureTime: bus.departureTime,
          price: bus.price
        };
      },
      (error) => {
        // Handles errors during bus details loading
        if (error.error.msg) {
          alert(error.error.msg); // Displays an alert with the error message
        }
        console.error('Error loading bus details:', error);
      }
    );
  }

  // onSubmit: Handles form submission (create or update bus)
  onSubmit() {
    if (this.isEditMode && this.busId) {
      // Edit mode: Updates an existing bus
      this.busService.updateBus(this.busId, { ...this.bus, busId: this.busId, bookedSeatNumbers: null }).subscribe(
        (response) => {
          // Success: Logs the response, sets success flag, and navigates to bus list
          console.log('Bus updated:', response);
          this.busAddedSuccessfully = true;
          setTimeout(() => {
            this.busAddedSuccessfully = false;
            this.router.navigate(['/bus-list']);
          }, 2000);
        },
        (error) => {
          // Error: Handles errors during bus update
          if (error.error.msg) {
            alert(error.error.msg);
          }
          console.error('Error updating bus:', error);
          this.busAddedSuccessfully = false;
        }
      );
    } else {
      // Create mode: Creates a new bus
      this.busService.createBus(this.bus).subscribe(
        (response) => {
          // Success: Logs the response, sets success flag, and resets the form
          console.log('Bus created:', response);
          this.busAddedSuccessfully = true;
          this.bus = {
            busNo: '',
            routeFrom: '',
            routeTo: '',
            seats: 0,
            availableSeats: 0,
            departureTime: '',
            price: 0
          };
          setTimeout(() => {
            this.busAddedSuccessfully = false;
          }, 2000);
        },
        (error) => {
          // Error: Handles errors during bus creation
          if (error.error.msg) {
            alert(error.error.msg);
          }
          console.error('Error creating bus:', error);
          this.busAddedSuccessfully = false;
        }
      );
    }
  }
}