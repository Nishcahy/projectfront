import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getUserRole();
  if(userRole==="admin" && authService.isAuthenticated()){
      return true;
  }else{
    router.navigate(['/login']);
    return false;
  }

};
