import { Injectable } from '@angular/core';
import { UnifiedAuthService } from '../../service/unified-auth.service';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  constructor(private unifiedAuth: UnifiedAuthService) {}

  getUsername(): string | null {
    const token = this.unifiedAuth.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.preferred_username || payload.sub || null;
    } catch {
      return null;
    }
  }

  /**
   * Retourne la liste de groupes/roles utilisables côté jBPM pour pot-owners par groupes.
   * Agrège realm_access.roles, resource_access[client].roles et token.groups (si présent).
   * Déduplique et conserve la casse telle quelle (doit correspondre au BPMN).
   */
  getGroups(): string[] {
    const token = this.unifiedAuth.getToken();
    const groups: string[] = [];
    if (!token) return groups;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // realms roles
      const realmRoles: string[] = payload?.realm_access?.roles || [];
      groups.push(...realmRoles);

      // client roles (tous clients)
      const resourceAccess = payload?.resource_access || {};
      Object.keys(resourceAccess).forEach((clientId) => {
        const clientRoles: string[] = resourceAccess[clientId]?.roles || [];
        groups.push(...clientRoles);
      });

      // token groups (optionnel)
      if (Array.isArray(payload?.groups)) {
        groups.push(...payload.groups);
      }

      // déduplication en conservant l'ordre d'apparition
      const seen = new Set<string>();
      const unique = groups.filter((g) => {
        if (!g) return false;
        if (seen.has(g)) return false;
        seen.add(g);
        return true;
      });

      return unique;
    } catch (e) {
      return groups;
    }
  }
}


