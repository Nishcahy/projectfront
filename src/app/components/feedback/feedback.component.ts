import { Component } from '@angular/core';
import { Feedback } from '../../model/interface/myReservation';
import { FeedbackService } from '../../services/feedback.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,MatSnackBarModule,DatePipe],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  feedbackList: Feedback[] = [];
  editingFeedbackId: number | null = null;
  userId: number | null = null; 
  deleteMessage: string | null = null;
  errorMessage: string | null = null;
  isFeedBackAvilable:boolean=false;

  editedFeedback: Feedback = {
    feedBackId: 0,
    userId: 0,
    reservationId: 0,
    complaintStatement: '',
    date: '',
    busId: 0,
  };

  constructor(private feedbackService: FeedbackService,private authService :AuthService,private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    
    this.userId = this.authService.getUserId();
    this.loadFeedback();
  }

  loadFeedback(): void  {
    if (this.userId !== null) {
      console.log(this.userId);
      this.feedbackService.getFeedbackByUserId(this.userId).subscribe(
        (feedback) => {
          this.feedbackList = feedback;
          this.isFeedBackAvilable=true;
        },
        (error) => {
          console.error('Error fetching feedback:', error);
          this.isFeedBackAvilable=false;
          if (error && error.error && error.error.msg) {
            this.snackbar.open(error.error.msg, 'Close', { duration: 5000 });
        } else {
            this.snackbar.open('Error adding feedback. Please try again.', 'Close', { duration: 5000 });
        }
        }
      );
    }
  }

  deleteFeedback(feedbackId: number): void {
    if (confirm('Are you sure you want to delete this feedback?')) {
        this.feedbackService.deleteFeedback(feedbackId).subscribe(
            () => {
                this.loadFeedback();
                this.deleteMessage = 'Feedback successfully removed.';
                this.errorMessage = null;
                setTimeout(() => {
                    this.deleteMessage = null; // Clear message after a delay
                }, 3000); // Clear after 3 seconds
            },
            (error) => {
                console.error('Error deleting feedback:', error);
                this.errorMessage = 'Failed to delete feedback. Please try again.';
                this.deleteMessage = null;
                setTimeout(() => {
                    this.errorMessage = null;
                }, 3000);
            }
        );
    }
}

  startEditing(feedback: Feedback): void {
    this.editingFeedbackId = feedback.feedBackId;
    this.editedFeedback = { ...feedback };
  }

  cancelEditing(): void {
    this.editingFeedbackId = null;
  }

  saveFeedback(): void {
    if (this.editingFeedbackId) {
      const updateData = {
        userId: this.editedFeedback.userId,
        reservationId: this.editedFeedback.reservationId,
        feedBackStatement: this.editedFeedback.complaintStatement,
      };

      this.feedbackService
        .updateFeedback(this.editingFeedbackId, updateData)
        .subscribe(() => {
          this.editingFeedbackId = null;
          this.loadFeedback();
        },
        (error) => {
          console.error("error updating feedback", error);
        });
    }
  }
}
