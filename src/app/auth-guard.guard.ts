import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role=authService.getUserRole();
  if (authService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false; // Prevent access to the route
  } 
};
