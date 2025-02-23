import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  

  constructor(private router: Router) {}

  onSubmit() {
    
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }


}
