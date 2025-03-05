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
    imports: [FormsModule,CommonModule,CurrencyPipe,DatePipe,UpperCasePipe],
})
export class AdminViewComponent implements OnInit {
    busNo: string = '';
    reservations: IMyReservation[] = [];
    feedbacks: Feedback[] = [];
    showFeedbacks: boolean = false;
    error: string = '';
    selectedItem: IMyReservation | null = null;

    constructor(
        private reservationService: MyReservationServiceService,
        private busService: BusService,
        private feedbackService: FeedbackService
    ) {}

    ngOnInit(): void {
        this.loadAllReservations();
    }

    loadAllReservations(): void {
        const observer: Observer<IMyReservation[]> = {
            next: (result: IMyReservation[]) => {
                console.log(result.length);
                if(result.length==0){
                    this.error = 'No reservations Available.';

                }else{
                    this.reservations = result;
                this.showFeedbacks = false;
                this.error = '';

                }
                
            },
            error: (err: any) => {
                console.error('API error:', err);
                this.error = 'Error loading reservations.';
                this.reservations = [];
            },
            complete: () => {
                console.log('API call completed');
            },
        };

        this.reservationService.getAllReservations().subscribe(observer);
    }

    loadFeedbacks(): void {
        const observer: Observer<Feedback[]> = {
            next: (result: Feedback[]) => {
                console.log(result);
                this.feedbacks = result;
                this.showFeedbacks = true;
                this.reservations = [];
                this.error = '';
            },
            error: (error: any) => {
                if(error.error){
                    this.error = error.error.msg;
                }else{
                    console.error('API error:', error);
                this.error = 'Error loading feedbacks.';
                this.feedbacks = [];

                }
                
            },
            complete: () => {
                console.log('API call completed');
            },
        };

        this.feedbackService.getAllFeedback().subscribe(observer);
    }

    searchReservations(): void {
        this.busService.searchBuses(this.busNo).subscribe(
            (buses) => {
                if (buses && buses.length > 0) {
                    this.reservationService.getReservationByBusId(buses[0].busId.toString()).subscribe(
                        (reservations) => {
                            this.reservations = reservations;
                            this.showFeedbacks = false;
                            this.error = '';
                        },
                        (error) => {
                            console.error('Error fetching reservations:', error);
                            this.error = 'Error fetching reservations.';
                            this.reservations = [];
                        }
                    );
                } else {
                    this.error = 'Bus not found.';
                    this.reservations = [];
                }
            },
            (error) => {
                console.error('Bus not found:', error);
                this.error = 'Bus not found.';
                this.reservations = [];
            }
        );
    }

    showPassengerDetails(item: IMyReservation) {
        this.selectedItem = item;
    }

    closePassengerDetails() {
        this.selectedItem = null;
    }

    trackByIndex(index: number, item: any): any {
        return index;
    }
}