import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, CommonModule, RouterOutlet, FooterComponent],
  templateUrl: './navbar.component.html',
  styles: [
    './navbar.component.css',
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css"
  ]
})

export class NavbarComponent {

  role: string | null = 'user'; // Initialize with a default role

  constructor(private authService: AuthService, private router: Router) { } // Inject AuthService

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
  }

  logout(): void {
    console.log("logout")
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    // Optionally, clear other user-related data (e.g., user profile)
    this.router.navigate(['/login']); // Redirect to login page
  }
}