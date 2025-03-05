import { Component, OnInit } from '@angular/core';
import { MyReservationServiceService } from '../../services/my-reservation-service.service';
import { IMyReservation } from '../../model/interface/myReservation';
import { Observer } from 'rxjs';
import { FeedbackService } from '../../services/feedback.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CommonModule, CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-my-reservation',
    templateUrl: './my-reservation.component.html',
    styleUrls: ['./my-reservation.component.css'],
    imports: [FormsModule, MatSnackBarModule,CommonModule,DatePipe,CurrencyPipe,UpperCasePipe],
})
export class MyReservationComponent implements OnInit {
    reservation: IMyReservation[] = [];
    selectedItem: IMyReservation | null = null;
    userId: number | null = null;
    feedbackStatements: string[] = [];
    showFeedbackInput: boolean = false;
    selectedReservationId: number = 0;
    isBooked:boolean=false;
    constructor(
        private myReservationService: MyReservationServiceService,
        private feedbackService: FeedbackService,
        private snackbar: MatSnackBar,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.userId = this.authService.getUserId();
        console.log(this.userId)
        if (this.userId !== null) {
            console.log(this.userId)
            this.loadReservations();
        } else {
            console.error('User ID is null');
            this.snackbar.open('User ID is not available. Please log in.', 'Close', { duration: 5000 });
        }
    }

    loadReservations(): void {
        if (this.userId === null) {
            console.error('User ID is null, cannot load reservations.');
            this.snackbar.open('User ID is not available. Please log in.', 'Close', { duration: 5000 });
            return;
        }

        const observer: Observer<IMyReservation[]> = {
            next: (result: IMyReservation[]) => {
                console.log(result + "++++++++");
                this.isBooked=true;
                this.reservation = result;
                this.feedbackStatements = new Array(result.length).fill('');
            },
            error: (error) => {
                console.error('API error:', error);
                 this.isBooked=false;
                if (error && error.error && error.error.msg) {
                    this.snackbar.open(error.error.msg, 'Close', { duration: 5000 });
                } else {
                    this.snackbar.open('Error adding feedback. Please try again.', 'Close', { duration: 5000 });
                }
            },
            complete: () => {
                console.log('API call completed');
            },
        };

        this.myReservationService.getMyReservation(this.userId).subscribe(observer);
    }

    trackByIndex(index: number, item: any): any {
        return index;
    }

    showPassengerDetails(item: IMyReservation) {
        this.selectedItem = item;
    }

    closePassengerDetails() {
        this.selectedItem = null;
    }

    deleteReservation(reservationId: number | undefined): void {
        if (reservationId === undefined) {
            console.error("reservationId is undefined");
            this.snackbar.open("Reservation ID is missing.", 'Close', { duration: 5000 });
            return;
        }

        this.myReservationService.deleteReservation(reservationId).subscribe(
            (response: string) => {
                console.log(response);
                this.loadReservations();
                this.snackbar.open("Reservation deleted successfully.", 'Close', { duration: 3000 });
            },
            (error) => {
                console.error(`Error deleting reservation ${reservationId}:`, error);

                if (error.status === 404 && error.error) {
                    try {
                        const parsedError = JSON.parse(error.error);
                        if (parsedError && parsedError.msg) {
                            this.snackbar.open(parsedError.msg, 'Close', { duration: 5000 });
                        } else {
                            this.snackbar.open('Reservation not found.', 'Close', { duration: 5000 });
                        }
                    } catch (parseError) {
                        console.error('Error parsing JSON:', parseError);
                        this.snackbar.open('Failed to delete reservation. Please try again.', 'Close', { duration: 5000 });
                    }
                } else if (error.status === 500 && error.error && error.error.message) {
                    this.snackbar.open(error.error.message, 'Close', { duration: 5000 });
                } else {
                    this.snackbar.open('Failed to delete reservation. Please try again.', 'Close', { duration: 5000 });
                }
            }
        );
    }

    openFeedbackInput(reservationId: number | undefined): void {
        if (reservationId === undefined) {
            console.error("reservationId is undefined");
            this.snackbar.open("Reservation ID is missing.", 'Close', { duration: 5000 });
            return;
        }
        this.selectedReservationId = reservationId;
        this.showFeedbackInput = true;
    }

    closeFeedbackInput(): void {
        this.showFeedbackInput = false;
    }

    getFeedbackIndex(): number {
        if (this.selectedReservationId !== undefined) {
            return this.reservation.findIndex(res => res.reservation.id === this.selectedReservationId);
        } else {
            return -1;
        }
    }

    addFeedback(): void {
        const feedbackIndex = this.getFeedbackIndex();
        if (feedbackIndex !== -1 && this.feedbackStatements[feedbackIndex]) {
            if (this.userId === null) {
                console.error("User id is null");
                this.snackbar.open("User id is null, please try again", 'Close', { duration: 5000 });
                return;
            }
            const feedback = {
                userId: this.userId,
                reservationId: this.selectedReservationId,
                feedBackStatement: this.feedbackStatements[feedbackIndex],
            };

            this.feedbackService.saveFeedback(feedback).subscribe(
                (response) => {
                    console.log('Feedback added successfully:', response);
                    this.closeFeedbackInput();
                    this.loadReservations();
                    this.snackbar.open('Feedback added successfully', 'Close', { duration: 3000 });
                },
                (error) => {
                    console.error('Error adding feedback:', error);
                    if (error && error.error && error.error.msg) {
                        this.snackbar.open(error.error.msg, 'Close', { duration: 5000 });
                    } else {
                        this.snackbar.open('Error adding feedback. Please try again.', 'Close', { duration: 5000 });
                    }
                }
            );
        } else {
            console.error('Invalid feedback index or feedback statement.');
            this.snackbar.open('Invalid feedback index or statement', 'Close', { duration: 5000 });
        }
    }
}