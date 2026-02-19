import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const publicGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  if (authService.currentUser()) return router.createUrlTree(['/tabs/tasks']);

  return true;

};
