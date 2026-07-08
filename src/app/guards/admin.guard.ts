import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const checkAdminAccess = (url: string) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } });
};

export const adminGuard: CanActivateFn & CanActivateChildFn = (_route, state) => checkAdminAccess(state.url);
