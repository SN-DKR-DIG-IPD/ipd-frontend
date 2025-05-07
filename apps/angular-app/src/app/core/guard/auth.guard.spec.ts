import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;
  let keycloakService: KeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, KeycloakService]
    });
    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    keycloakService = TestBed.inject(KeycloakService);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });


});

