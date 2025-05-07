import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ThemeModel } from '../../../data/model/theme.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import defaultTheme from '../../../data/json/default.theme.json';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  public theme$ = new BehaviorSubject<ThemeModel>(defaultTheme);
  private readonly userApiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  save(data: ThemeModel): Observable<any> {
    const url = this.userApiUrl + '/theme';
    return this.http.post(url, data);
  }

}
