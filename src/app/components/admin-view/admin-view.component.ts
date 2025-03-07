import { Component, OnInit } from '@angular/core';
import { MyReservationServiceService } from '../../services/my-reservation-service.service';
import { BusService } from '../../services/bus.service';
import { FeedbackService } from '../../services/feedback.service';
import { IMyReservation, Feedback } from '../../model/interface/myReservation';
import { Observer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-admin-view',
    templateUrl: './admin-view.component.html',
    styleUrls: ['./admin-view.component.css'],
    imports: [FormsModule, CommonModule, CurrencyPipe, DatePipe, UpperCasePipe],
})
export class AdminViewComponent implements OnInit {
    busNo: string = ''; // Input for bus number search
    reservations: IMyReservation[] = []; // Array to store reservation data
    feedbacks: Feedback[] = []; // Array to store feedback data
    showFeedbacks: boolean = false; // Flag to toggle feedback display
    error: string = ''; // Variable to store error messages
    selectedItem: IMyReservation | null = null; // Stores the selected reservation item for detailed view

    constructor(
        private reservationService: MyReservationServiceService, // Inject reservation service
        private busService: BusService, // Inject bus service
        private feedbackService: FeedbackService // Inject feedback service
    ) { }

    ngOnInit(): void {
        this.loadAllReservations(); // Load all reservations on component initialization
    }

    loadAllReservations(): void {
        // Observer for handling reservation data
        const observer: Observer<IMyReservation[]> = {
            next: (result: IMyReservation[]) => {
                console.log(result.length);
                if (result.length == 0) {
                    this.error = 'No reservations Available.'; // Set error if no reservations found
                } else {
                    this.reservations = result; // Store fetched reservations
                    this.showFeedbacks = false; // Hide feedbacks
                    this.error = ''; // Clear error message
                }
            },
            error: (err: any) => {
                if (err.error) {
                    this.error = err.error.msg; // Set error message from API response
                }
                console.error('API error:', err);
                this.error = 'Error loading reservations.'; // Generic error message
                this.reservations = []; // Clear reservations array
            },
            complete: () => {
                console.log('API call completed'); // Log API call completion
            },
        };

        this.reservationService.getAllReservations().subscribe(observer); // Subscribe to reservation service
    }

    loadFeedbacks(): void {
        // Observer for handling feedback data
        const observer: Observer<Feedback[]> = {
            next: (result: Feedback[]) => {
                console.log(result);
                this.feedbacks = result; // Store fetched feedbacks
                this.showFeedbacks = true; // Show feedbacks
                this.reservations = []; // Clear reservations array
                this.error = ''; // Clear error message
            },
            error: (error: any) => {
                if (error.error) {
                    this.error = error.error.msg; // Set error message from API response
                } else {
                    console.error('API error:', error);
                    this.error = 'Error loading feedbacks.'; // Generic error message
                    this.feedbacks = []; // Clear feedbacks array
                }
            },
            complete: () => {
                console.log('API call completed'); // Log API call completion
            },
        };

        this.feedbackService.getAllFeedback().subscribe(observer); // Subscribe to feedback service
    }

    searchReservations(): void {
        // Search reservations based on bus number
        this.busService.searchBuses(this.busNo).subscribe(
            (buses) => {
                if (buses && buses.length > 0) {
                    // If bus found, fetch reservations by bus ID
                    this.reservationService.getReservationByBusId(buses[0].busId.toString()).subscribe(
                        (reservations) => {
                            this.reservations = reservations; // Store fetched reservations
                            this.showFeedbacks = false; // Hide feedbacks
                            this.error = ''; // Clear error message
                        },
                        (error) => {
                            this.error = error.error.msg; // Set error message from API response
                            console.error('Error fetching reservations:', error);
                            this.error = 'Error fetching reservations.'; // Generic error message
                            this.reservations = []; // Clear reservations array
                        }
                    );
                } else {
                    this.error = 'Bus not found.'; // Set error if bus not found
                    this.reservations = []; // Clear reservations array
                }
            },
            (error) => {
                console.error('Bus not found:', error);
                this.error = 'Bus not found.'; // Set error if bus not found
                this.reservations = []; // Clear reservations array
            }
        );
    }

    showPassengerDetails(item: IMyReservation) {
        this.selectedItem = item; // Set selected item for detailed view
    }

    closePassengerDetails() {
        this.selectedItem = null; // Clear selected item
    }

    trackByIndex(index: number, item: any): any {
        return index; // Track items by index for ngFor
    }
}