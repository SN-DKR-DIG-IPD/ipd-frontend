import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {IPaginatedRoles, IRole} from '@data/model/role.model';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from '../application-config.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleApiUrl = this.applicationConfigService.getEndpointForUserManager('v1/roles');

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  getRoles(page: number = 0, size: number = 25, name?: string): Observable<IPaginatedRoles> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (name) {
      params = params.set('description', name);
    }

    return this.http.get<IPaginatedRoles>(this.roleApiUrl, { params });
  }

  createRole(role: any): Observable<IRole> {
    return this.http.post<IRole>(this.roleApiUrl, role);
  }

  getRole(roleId: number): Observable<IRole> {
    return this.http.get<IRole>(this.roleApiUrl + '/' + roleId);
  }

  findRole(name: string): Observable<IRole> {
    return this.http.get<IRole>(this.roleApiUrl + '/_name/' + name);
  }

  updateRole(roleId: number, role: any): Observable<IRole> {
    return this.http.put<IRole>(this.roleApiUrl + '/' + roleId, role);
  }
}
