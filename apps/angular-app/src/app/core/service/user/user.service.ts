import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, Observer, retry, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly userApiUrl = `${environment.apiUrl}`;
  private readonly baseApiUrl = `${environment.businessCentralAPIBaseUrl}`;

  private userProfile$ = new BehaviorSubject<KeycloakProfile>({});

  constructor(private http: HttpClient) { }

  private getRequestOptions(){
    const token = sessionStorage.getItem('defaultHeader')
    console.log('**', token)
    return {
       headers : new HttpHeaders ({
          // 'Content-Type':'application/json',
          // Accept : 'application/json',
          // Authorization: `Basic ${token}`
       }),
       withCredentials: true
    };
  }

  private customErrorHandler(error : HttpErrorResponse) {
    let errorMessage = 'une erreur est survenue';

    if(error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    }else {
      switch (error.status) {
        case 401:
          errorMessage = 'UnAuthorized make sur your connected';
          break;
        case 403:
          errorMessage = 'Access refuse';
          break;
        case 404:
          errorMessage = 'user not found';
          break;
        case 500:
          errorMessage = 'internal serveur error'
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`
      }
    }

    // console.error(errorMessage);
    return throwError (() => new Error(errorMessage));
  }

  getAllUsers() :Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users`, this.getRequestOptions()).pipe(
      // retry(1),
      catchError(this.customErrorHandler)
    )
  }

  getUserGroups(userName: string):Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users/${userName}/groups`, this.getRequestOptions()).pipe(
      catchError(this.customErrorHandler)
    )
  }

  getUserRoles(userName: string):Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users/${userName}/roles`, this.getRequestOptions()).pipe(
      catchError(this.customErrorHandler)
    )
  }



  createUserWithRolesAndGroups(name: string, roles: string[]):Observable<any> {
    const body = {
      name: name,
      roles:roles,
      // groups:groups
    };

    const requestOptions = this.getRequestOptions();

    return this.http.post<any>(`${this.baseApiUrl}users`,body , requestOptions).pipe(     
      catchError(this.customErrorHandler)
    );
  }


  getUserProfile(): KeycloakProfile {
    return this.userProfile$.getValue();
  }

  setUserProfile(userProfile: KeycloakProfile): void {
    this.userProfile$.next(userProfile);
  }

  findAll(): Observable<any> {
    // return this.http.get(this.userApiUrl);
      return this.http.get( `${this.userApiUrl}`,{ withCredentials: true });
  }

  createOrUpdate(data: any, resourceIdentity = 'id'): Observable<any> {
    if (data[`${resourceIdentity}`]) {
      return this.http.put(`${this.userApiUrl}/${data[`${resourceIdentity}`]}`, data);
    }
    return this.http.post(this.userApiUrl, data);
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(this.userApiUrl + '/' + id);
  }

  updateUserPassword(id: string | number, pwd: string): Observable<any> {
    return this.http.put(this.userApiUrl + '/update/' + id, pwd);
  }

}
