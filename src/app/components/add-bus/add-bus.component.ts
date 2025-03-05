import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IBus } from '../../model/interface/myReservation';
import { BusService } from '../../services/bus.service';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-bus',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-bus.component.html',
  styleUrl: './add-bus.component.css'
})
export class AddBUsComponent {

  bus: Omit<IBus, 'busId' | 'bookedSeatNumbers'> = {
    busNo: '',
    routeFrom: '',
    routeTo: '',
    seats: 0,
    availableSeats: 0,
    departureTime: '',
    price: 0
  };
  busAddedSuccessfully = false;
  isEditMode = false; // Add this property
  busId: number | null = null; // Add this property

  constructor(private busService: BusService, private route: ActivatedRoute, private router: Router) {} // Inject ActivatedRoute and Router

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.busId = +params['id'];
        this.loadBusDetails(this.busId);
      }
    });
  }

  loadBusDetails(id: number) {
    this.busService.getBusById(id).subscribe(
      (bus) => {
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
        console.error('Error loading bus details:', error);
      }
    );
  }

  onSubmit() {
    if (this.isEditMode && this.busId) {
      // Update bus
      this.busService.updateBus(this.busId, { ...this.bus, busId: this.busId, bookedSeatNumbers: null }).subscribe(
        (response) => {
          console.log('Bus updated:', response);
          this.busAddedSuccessfully = true;
          setTimeout(() => {
            this.busAddedSuccessfully = false;
            this.router.navigate(['/bus-list']);
          }, 2000);
        },
        (error) => {
          console.error('Error updating bus:', error);
          this.busAddedSuccessfully = false;
        }
      );
    } else {
      // Add bus
      this.busService.createBus(this.bus).subscribe(
        (response) => {
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
          console.error('Error creating bus:', error);
          this.busAddedSuccessfully = false;
        }
      );
    }
  }
}