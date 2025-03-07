import { Component } from '@angular/core';
import { Feedback } from '../../model/interface/myReservation';
import { FeedbackService } from '../../services/feedback.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatSnackBarModule, DatePipe],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  feedbackList: Feedback[] = []; // Array to store the list of feedback
  editingFeedbackId: number | null = null; // ID of the feedback being edited
  userId: number | null = null; // User ID from the authentication service
  deleteMessage: string | null = null; // Message to display after successful deletion
  errorMessage: string | null = null; // Message to display for errors
  isFeedBackAvilable: boolean = false; // Flag to indicate if feedback is available

  editedFeedback: Feedback = {
    feedBackId: 0,
    userId: 0,
    reservationId: 0,
    complaintStatement: '',
    date: '',
    busId: 0,
  };

  constructor(private feedbackService: FeedbackService, private authService: AuthService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Get the user ID from the authentication service
    this.loadFeedback(); // Load feedback for the user
  }

  loadFeedback(): void {
    if (this.userId !== null) {
      console.log(this.userId);
      this.feedbackService.getFeedbackByUserId(this.userId).subscribe(
        (feedback) => {
          this.feedbackList = feedback; // Assign fetched feedback to the list
          this.isFeedBackAvilable = true; // Set flag to true as feedback is available
        },
        (error) => {
          console.error('Error fetching feedback:', error);
          this.isFeedBackAvilable = false; // Set flag to false as feedback fetch failed
          if (error && error.error && error.error.msg) {
            this.snackbar.open(error.error.msg, 'Close', { duration: 5000 }); // Display error message using snackbar
          } else {
            this.snackbar.open('Error adding feedback. Please try again.', 'Close', { duration: 5000 }); // Generic error message
          }
        }
      );
    }
  }

  deleteFeedback(feedbackId: number): void {
    if (confirm('Are you sure you want to delete this feedback?')) { // Confirm deletion
      this.feedbackService.deleteFeedback(feedbackId).subscribe(
        () => {
          this.loadFeedback(); // Reload feedback after deletion
          this.deleteMessage = 'Feedback successfully removed.'; // Set success message
          this.errorMessage = null; // Clear error message
          setTimeout(() => {
            this.deleteMessage = null; // Clear message after a delay
          }, 3000); // Clear after 3 seconds
        },
        (error) => {
          console.error('Error deleting feedback:', error);
          this.errorMessage = 'Failed to delete feedback. Please try again.'; // Set error message
          this.deleteMessage = null; // Clear success message
          setTimeout(() => {
            this.errorMessage = null; // Clear error message after a delay
          }, 3000);
        }
      );
    }
  }

  startEditing(feedback: Feedback): void {
    this.editingFeedbackId = feedback.feedBackId; // Set the ID of the feedback being edited
    this.editedFeedback = { ...feedback }; // Copy feedback data for editing
  }

  cancelEditing(): void {
    this.editingFeedbackId = null; // Cancel editing
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
          this.editingFeedbackId = null; // Clear editing ID after successful update
          this.loadFeedback(); // Reload feedback
        },
        (error) => {
          console.error("error updating feedback", error);
        });
    }
  }
}