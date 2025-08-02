import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UnifiedAuthService } from '../service/unified-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private unifiedAuthService: UnifiedAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Aucun rôle requis
    }

    const hasRequiredRole = this.unifiedAuthService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      console.log(`❌ Rôles insuffisants. Requis: ${requiredRoles.join(', ')}`);
      this.router.navigate(['/unauthorized']);
      return false;
    }

    console.log(`✅ Accès autorisé avec rôles: ${requiredRoles.join(', ')}`);
    return true;
  }
} 