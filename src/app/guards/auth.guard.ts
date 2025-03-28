import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalAuthService } from '../authentication/services/local-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localService = inject(LocalAuthService);
  const router = inject(Router);
  const user = localService.getUser();
  if (user) {
    return true;
  }
  return router.createUrlTree(['/auth']);
};
