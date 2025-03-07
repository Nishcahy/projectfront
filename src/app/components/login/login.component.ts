import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login', // Component selector
  imports: [FormsModule, RouterModule, CommonModule], // Imports modules used in the template
  templateUrl: './login.component.html', // Path to the component's HTML template
  styleUrl: './login.component.css' // Path to the component's CSS styles
})
export class LoginComponent {
  username = ''; // Stores the username entered by the user
  password = ''; // Stores the password entered by the user
  errorMessage = ''; // Stores any error message to be displayed

  constructor(private authService: AuthService, private router: Router) { } // Inject AuthService and Router

  login() {
    // Calls the login method of the AuthService, passing the username and password
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response) => {
        // Successful login
        console.log('Login successful', response);
        // Access token and userId from the response
        const token = response.token; // Extracts the token from the response
        const userId = response.userId; // Extracts the user ID from the response
        console.log('Token:', token); // Logs the token to the console
        console.log('User ID:', userId); // Logs the user ID to the console

        this.router.navigate(['/home']); // Navigates to the home page after successful login
      },
      (error) => {
        // Failed login
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password'; // Sets the error message
      }
    );
  }
}