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
  busId: number = 0;
  selectedBus: IBus | null = null;
   userId:number |null=0;
  bookingDate: string = '';
  numberOfSeats: number = 0;
  selectedSeats: number[] = [];
  passengers: IPassenger[] = [];
  showSeatSelectionPopup = false;
  bookedSeats: number[] = [];
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private reservationService: MyReservationServiceService,
    private authService:AuthService,
  ) {}

  ngOnInit(): void {
    this.userId=this.authService.getUserId();
    this.route.params.subscribe((params) => {
      this.busId = +params['busId'];
      this.fetchBusDetails();
    });
    
  }

  closeModal() {
    this.router.navigate(['/search-bus']);
  }
  isPassengerDetailsValid(): boolean {
    if (!this.selectedSeats || this.selectedSeats.length === 0) {
      return false;
    }
  
    for (let passenger of this.passengers) {
      if (!passenger || !passenger.name || !passenger.gender || !passenger.age) {
        return false;
      }
    }
  
    return true;
  }

  fetchBusDetails(): void {
    const url = `http://localhost:8082/api/buses/findBus/${this.busId}`;

    this.http.get<IBus>(url).subscribe(
      (data) => {
        this.selectedBus = data;
        if (this.selectedBus && this.selectedBus.bookedSeatNumbers) {
          this.bookedSeats = this.selectedBus.bookedSeatNumbers;
        }
        this.error = null;
      },
      (error) => {
        console.error('Error fetching bus details:', error);
        this.error = 'Failed to fetch bus details. Please try again.';
      }
    );
  }

  openSeatSelection(): void {
    if (this.selectedBus && this.selectedBus.seats) {
      this.showSeatSelectionPopup = true;
      this.error = null;
    }
  }

  closeSeatSelection(): void {
    this.showSeatSelectionPopup = false;
    this.error = null;
  }

  selectSeat(seatNumber: number): void {
    if (this.selectedSeats.includes(seatNumber)) {
      this.selectedSeats = this.selectedSeats.filter((seat) => seat !== seatNumber);
      this.passengers = this.passengers.filter((p) => p.seatNumber !== seatNumber);
    } else {
      if (this.selectedSeats.length < this.numberOfSeats) {
        const newPassenger: IPassenger = {
          name: '',
          gender: 'male',
          age: 0,
          seatNumber: seatNumber,
        };
        this.selectedSeats.push(seatNumber);
        this.passengers.push(newPassenger);
      }
    }
    this.closeSeatSelection();
    this.error = null;
  }

  getSeatsArray(count: number): number[] {
    return Array(count).fill(0).map((x, i) => i + 1);
  }

  isSeatBooked(seatNumber: number): boolean {
    return this.bookedSeats.includes(seatNumber);
  }

  confirmBooking(): void {
    if (!this.selectedBus || !this.bookingDate || this.selectedSeats.length !== this.numberOfSeats) {
      this.error = 'Please fill in all required fields and select the correct number of seats.';
      return;
    }

    const reservation: Omit<IReservation, 'id' | 'totalAmount'> = {
      userId: this.userId!,
      busId: this.selectedBus.busId,
      date: this.bookingDate,
      numberOfSeats: this.numberOfSeats,
      passengers: this.passengers.map((passenger) => {
        const { pid, ...passengerWithoutPid } = passenger;
        return passengerWithoutPid;
      }),
    };

    console.log('Reservation data:', reservation);

    this.reservationService.addReservation(reservation).subscribe(
      (response) => {
        console.log('Booking successful:', response);
        this.router.navigate(['/my-reservation']);
        this.error = null;
      },
      (error) => {
        console.error('Booking failed:', error);
        if (error.error && error.error.message) {
          this.error = error.error.message; // Display server-side error message
        } else {
          this.error = 'Booking failed. Please try again.';
        }
      }
    );
  }
}