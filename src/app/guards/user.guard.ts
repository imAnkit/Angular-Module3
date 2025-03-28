import { CanActivateFn, Router } from '@angular/router';
import { LocalAuthService } from '../authentication/services/local-auth.service';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const localService = inject(LocalAuthService);
  const router = inject(Router);
  const user = localService.getUser();
  if (user && user.type === 'user') {
    return true;
  } else if (user && user.type === 'admin') {
    return router.createUrlTree(['/admin']);
  }
  return router.createUrlTree(['/auth']);
};
