import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchBusesComponent } from '../search-buses/search-buses.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private authService:AuthService) {} // Inject Router
  
  role: string | null = 'user';
 
  ngOnInit(): void {
      this.role=this.authService.getUserRole();
  }
  navigateToSearch() {
    console.log('clicked')
    this.router.navigate(['/search-bus']); // Navigate to /search
  }
  


}
