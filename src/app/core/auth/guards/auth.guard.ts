import {inject} from '@angular/core';
import {Router, CanActivateFn} from '@angular/router';
import {AuthService} from '../services/auth-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = await authService.getToken();

  if (token) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
