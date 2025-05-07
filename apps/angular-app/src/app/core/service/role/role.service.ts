import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private readonly roleApiUrl = `${environment.apiUrl}/roles`;
  private readonly baseApiUrl = `${environment.businessCentralAPIBaseUrl}`

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
            errorMessage = 'role not found';
            break;
          case 500:
            errorMessage = 'internal serveur error'
            break;
          default:
            errorMessage = `Erreur ${error.status}: ${error.message}`
        }
      }
  
      console.error(errorMessage);
      return throwError (() => new Error(errorMessage));
    }
  
  findAllRoles():Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}roles` , this.getRequestOptions()).pipe(
      catchError(this.customErrorHandler)
    )
  }

  getUserRoles(username:string):Observable<String>{
    return this.http.get<string>(`${this.baseApiUrl}/users/${username}/roles`, this.getRequestOptions()).pipe(
      catchError(this.customErrorHandler)
    )
  }
  
  deleteRole(roleName: string):Observable<string>{
    return this.http.delete<string>(`${this.baseApiUrl}/roles/${roleName}`, this.getRequestOptions())
  }



  findAll(): Observable<any> {
    return this.http.get(this.roleApiUrl);
  }



  createOrUpdate(data: any, resourceIdentity = 'roleId'): Observable<any> {
    if (data[`${resourceIdentity}`]) {
      return this.http.put(`${this.roleApiUrl}/${data[`${resourceIdentity}`]}`, data);
    }
    return this.http.post(this.roleApiUrl, data);
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(this.roleApiUrl + '/' + id);
  }
}

