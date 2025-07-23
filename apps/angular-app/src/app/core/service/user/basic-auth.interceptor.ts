import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/jbpm/api')) {
      const token = this.authService.getToken();
      if (token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Basic ${token}` }
        });
        return next.handle(authReq);
      }
    }
    return next.handle(req);
  }
} 