import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { inject } from '@angular/core';

export const RoleGuard: CanActivateFn = async (route) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string;

  if (keycloakService.isLoggedIn()) {
    try {
      const hasRole = keycloakService.isUserInRole(requiredRoles);
      if (hasRole) {
        return true;
      } else {
        await router.navigateByUrl('/access-denied');
        return false;
      }
    } catch (error) {
      await router.navigateByUrl('/access-denied');
      return false;
    }
  } else {
    await router.navigateByUrl('/');
    return false;
  }
};
