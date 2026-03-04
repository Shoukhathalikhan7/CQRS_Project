import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    router.navigate(['/']);
    return false;
  }

  if (route.routeConfig?.path === 'users' && role !== 'Admin') {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};