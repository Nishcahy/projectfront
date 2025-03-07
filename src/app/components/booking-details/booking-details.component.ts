import { Component, OnInit } from '@angular/core';
import { IBus, IReservation, IPassenger } from '../../model/interface/myReservation';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MyReservationServiceService } from '../../services/my-reservation-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
})
export class BookingDetailsComponent implements OnInit {
  busId: number = 0; // Stores the bus ID from the route parameters
  selectedBus: IBus | null = null; // Stores the selected bus details
  userId: number | null = 0; // Stores the user ID from the authentication service
  bookingDate: string = ''; // Stores the booking date
  numberOfSeats: number = 0; // Stores the number of seats to be booked
  selectedSeats: number[] = []; // Stores the selected seat numbers
  passengers: IPassenger[] = []; // Stores the passenger details
  showSeatSelectionPopup = false; // Flag to show or hide the seat selection popup
  bookedSeats: number[] = []; // Stores the booked seat numbers for the selected bus
  error: string | null = null; // Stores error messages

  constructor(
    private route: ActivatedRoute, // Injects the ActivatedRoute service
    private http: HttpClient, // Injects the HttpClient service
    private router: Router, // Injects the Router service
    private reservationService: MyReservationServiceService, // Injects the reservation service
    private authService: AuthService, // Injects the authentication service
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Gets the user ID from the authentication service
    this.route.params.subscribe((params) => {
      this.busId = +params['busId']; // Gets the bus ID from the route parameters
      this.fetchBusDetails(); // Fetches the bus details
    });
  }

  closeModal() {
    this.router.navigate(['/search-bus']); // Navigates to the search bus page
  }

  isPassengerDetailsValid(): boolean {
    if (!this.selectedSeats || this.selectedSeats.length === 0) {
      return false; // Returns false if no seats are selected
    }

    for (let passenger of this.passengers) {
      if (!passenger || !passenger.name || !passenger.gender || !passenger.age) {
        return false; // Returns false if any passenger details are invalid
      }
    }

    return true; // Returns true if all passenger details are valid
  }

  fetchBusDetails(): void {
    const url = `http://localhost:8082/api/buses/findBus/${this.busId}`; // Constructs the API URL

    this.http.get<IBus>(url).subscribe(
      (data) => {
        this.selectedBus = data; // Stores the fetched bus details
        if (this.selectedBus && this.selectedBus.bookedSeatNumbers) {
          this.bookedSeats = this.selectedBus.bookedSeatNumbers; // Stores the booked seat numbers
        }
        this.error = null; // Clears the error message
      },
      (error) => {
        console.error('Error fetching bus details:', error);
        this.error = 'Failed to fetch bus details. Please try again.'; // Sets the error message
      }
    );
  }

  openSeatSelection(): void {
    if (this.selectedBus && this.selectedBus.seats) {
      this.showSeatSelectionPopup = true; // Shows the seat selection popup
      this.error = null; // Clears the error message
    }
  }

  closeSeatSelection(): void {
    this.showSeatSelectionPopup = false; // Hides the seat selection popup
    this.error = null; // Clears the error message
  }

  selectSeat(seatNumber: number): void {
    if (this.selectedSeats.includes(seatNumber)) {
      this.selectedSeats = this.selectedSeats.filter((seat) => seat !== seatNumber); // Removes the seat from the selected seats array
      this.passengers = this.passengers.filter((p) => p.seatNumber !== seatNumber); // Removes the passenger from the passengers array
    } else {
      if (this.selectedSeats.length < this.numberOfSeats) {
        const newPassenger: IPassenger = {
          name: '',
          gender: 'male',
          age: 0,
          seatNumber: seatNumber,
        };
        this.selectedSeats.push(seatNumber); // Adds the seat to the selected seats array
        this.passengers.push(newPassenger); // Adds a new passenger to the passengers array
      }
    }
    this.closeSeatSelection(); // Closes the seat selection popup
    this.error = null; // Clears the error message
  }

  getSeatsArray(count: number): number[] {
    return Array(count).fill(0).map((x, i) => i + 1); // Creates an array of seat numbers
  }

  isSeatBooked(seatNumber: number): boolean {
    return this.bookedSeats.includes(seatNumber); // Checks if the seat is booked
  }

  confirmBooking(): void {
    if (!this.selectedBus || !this.bookingDate || this.selectedSeats.length !== this.numberOfSeats) {
      this.error = 'Please fill in all required fields and select the correct number of seats.'; // Sets the error message
      return;
    }

    const reservation: Omit<IReservation, 'id' | 'totalAmount'> = {
      userId: this.userId!, // Gets the user ID
      busId: this.selectedBus.busId, // Gets the bus ID
      date: this.bookingDate, // Gets the booking date
      numberOfSeats: this.numberOfSeats, // Gets the number of seats
      passengers: this.passengers.map((passenger) => {
        const { pid, ...passengerWithoutPid } = passenger; // Removes the passenger ID
        return passengerWithoutPid; // Returns the passenger without the ID
      }),
    };

    console.log('Reservation data:', reservation);

    this.reservationService.addReservation(reservation).subscribe(
      (response) => {
        console.log('Booking successful:', response);
        this.router.navigate(['/my-reservation']); // Navigates to the my reservation page
        this.error = null; // Clears the error message
      },
      (error) => {
        console.error('Booking failed:', error);
        if (error.error && error.error.message) {
          this.error = error.error.message; // Displays server-side error message
        } else {
          this.error = 'Booking failed. Please try again.'; // Sets the generic error message
        }
      }
    );
  }
}