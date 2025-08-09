import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  // ✅ CORRIGÉ: Utilise environment (qui lit window.__env)
  private apiUrl = environment.bpmAPIBaseUrl;

  constructor(private http: HttpClient) { }

  getProcessDiagram(containerId: string, processId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}server/containers/${containerId}/processes/${processId}/diagram`, { responseType: 'text' });
  }

  getProcessInstanceDiagram(containerId: string, processInstanceId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/diagram`, { responseType: 'text' });
  }
} 