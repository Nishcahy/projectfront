import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutUsComponent } from '../about-us/about-us.component';


@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule,AboutUsComponent],
  templateUrl: './navbar.component.html',
  styles: [
  './navbar.component.css',
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css"
]
})

export class NavbarComponent {

  
}