import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBusesComponent } from './components/search-buses/search-buses.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AddBUsComponent } from './components/add-bus/add-bus.component';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { authGuardGuard } from './auth-guard.guard';
import { adminGuardGuard } from './admin-guard.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: 'home', component: HomeComponent ,canActivate: [authGuardGuard]},
      { path: 'my-reservation', component: MyReservationComponent,canActivate: [authGuardGuard] },
      { path: 'about-us', component: AboutUsComponent,canActivate: [authGuardGuard] },
      { path: 'search-bus', component: SearchBusesComponent,canActivate: [authGuardGuard] },
      { path: 'feedback', component: FeedbackComponent,canActivate: [authGuardGuard] },
      { path: 'addbus', component: AddBUsComponent,canActivate: [adminGuardGuard]},
      { path: 'bus-list', component: BusListComponent,canActivate: [adminGuardGuard] },
      { path: 'edit-bus/:id', component: AddBUsComponent,canActivate: [adminGuardGuard] },
      {path: 'booking/:busId', component: BookingDetailsComponent,canActivate: [authGuardGuard]},
      {path:'get-all-booking',component:AdminViewComponent,canActivate: [adminGuardGuard]}
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Wildcard route at the end
];