import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const userRole = auth.getRole();

  if (userRole !== expectedRole) {
    router.navigate(
      ['/login'],
      { queryParams: { redirect: state.url } }
    );
    return false;
  }

  return true;
};
