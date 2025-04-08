import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from, Observable, switchMap } from 'rxjs';
import { ApplicationConfigService } from './../application-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthPermissionsService {
  private permissionUrl =
    this.applicationConfigService.getEndpointForUserManager('v1/permissions');

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  getUserPermissions(): Observable<any> {
    return from(this.keycloakService.loadUserProfile()).pipe(
      switchMap(userProfile => {
        const userId = userProfile.id;
        const url = `${this.permissionUrl}/${userId}`;
        return this.http.get<any>(url);
      })
    );
  }
}
