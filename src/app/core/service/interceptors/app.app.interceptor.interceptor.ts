import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';


import { Observable } from 'rxjs';
import { Router} from '@angular/router';

/** Pass untouched request through to the next request handler. */
// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class AppInterceptor implements HttpInterceptor {
  token: any;
  constructor(private router: Router) { }
  /**
   * This method can play the role of a constructor in an interceptor
   * @param {HttpRequest<any>} req - The actual URL to be executed
   * @param {HttpHandler} next - Param to handle a request after execution
   * @returns {Observable<HttpEvent<any>>} - The result of the request in an observable
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newReq;
    const started = Date.now();
    let ok: string;
    let unauthorized: boolean = false;
    // const auth_token = LocalStorage.getItem('auth_token');

    newReq = req.clone();

    if ((req.url.match(/assets/g) || []).length === 1) {
      newReq = req.clone({
        url: req.url
      });
    }

    return next.handle(newReq);
  }
}
