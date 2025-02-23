import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBusesComponent } from './components/search-buses/search-buses.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';

export const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    { 
        path: 'search-bus', 
        component: SearchBusesComponent 
    },
    { 
        path: 'home', 
        component: HomeComponent 
    },
    { 
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full' 
    },
    {
        path:'about-us',
        component:AboutUsComponent
    },
    {
        path:'my-reservation',
        component:MyReservationComponent
    }

];
