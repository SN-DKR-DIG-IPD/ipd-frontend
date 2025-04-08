import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserApiResponse } from '@data/model/user.model';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { ApplicationConfigService } from '../application-config.service';
import { GlobalErrorHandlerService } from '../global-error-handler/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = this.applicationConfigService.getEndpointForUserManager('v1/users');

  public userProfile$ = new BehaviorSubject<KeycloakProfile>({});
  public userManagerProfile$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private httpError: GlobalErrorHandlerService,
    private applicationConfigService: ApplicationConfigService
  ) {
  }

  getUserProfile(): KeycloakProfile {
    return this.userProfile$.getValue();
  }
  getUserProfileAuto(): Observable<User> {
    const userProfile = this.getUserProfile();
    let lst: any
    if (localStorage.getItem('reference'))
      lst = localStorage?.getItem('reference')
    return this.getUserByUserKeycloakId(userProfile.id || lst);
  }
  getUserData(userId: string | number): Observable<User> {
    return this.http
      .get<User>(`${this.userApiUrl}/${userId}`)
      .pipe(catchError(err => this.httpError.serviceErrorHandler<any>(err)));
  }

  setUserProfile(userProfile: KeycloakProfile): void {
    this.userProfile$.next(userProfile);
  }

  findAll(): Observable<any> {
    return this.http.get(this.userApiUrl).pipe(
      catchError(err => this.httpError.serviceErrorHandler<any>(err))
    );
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

  getUsers(pageNumber = 0, pageSize = 10, role?: string, name?: string): Observable<UserApiResponse> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', 'userCreationDate,desc');
    if (role) {
      params = params.set('roles', role);
    }
    if (name) {
      params = params.set('firstName', name);
    }

    return this.http.get<UserApiResponse>(this.userApiUrl, { params }).pipe(
      catchError(err => this.httpError.serviceErrorHandler<any>(err))
    )
  }

  readUsersByIds(listIds: number[]): Observable<User[]> {

    let params = new HttpParams()
      .set('listIds', listIds.toString())
    return this.http.get<User[]>(this.userApiUrl + '/readByIds', { params }).pipe(
      catchError(err => this.httpError.serviceErrorHandler<any>(err))
    );
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.userApiUrl, user);
  }

  updateUser(userId: string, userPayload: any): Observable<User> {
    return this.http.put<User>(`${this.userApiUrl}/${userId}`, userPayload);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/username/${username}`);
  }

  getUserByUserKeycloakId(userKeycloakId: string): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/reference/${userKeycloakId}`);
  }

  updateUserStatus(userId: number, isEnable: boolean): Observable<any> {
    const params = new HttpParams()
      .set('isEnable', isEnable.toString())
      .set('sort', 'userModificationDate,desc');
    return this.http.patch(`${this.userApiUrl}/${userId}`, null, { params });
  }
}
