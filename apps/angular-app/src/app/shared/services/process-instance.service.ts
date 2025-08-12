import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessInstanceService {
  // ✅ CORRIGÉ: Utilise environment (qui lit window.__env)
  private apiUrl = environment.bpmAPIBaseUrl;

  constructor(private http: HttpClient) { }

  // ✅ MÉTHODES OBSERVABLE (nouvelle approche)
  createProcessInstance(containerId: string, processId: string, data: any = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}server/containers/${containerId}/processes/${processId}/instances`, data);
  }

  getProcessInstance(containerId: string, processInstanceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}server/containers/${containerId}/processes/instances/${processInstanceId}`);
  }

  // ✅ MÉTHODES PROMISE (compatibilité avec l'existant)
  async getAllProcessInstances(containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/processes/instances`).toPromise();
      console.log('🔍 ProcessInstanceService: Résultat brut:', result);
      
      // Si le résultat a une structure imbriquée, extraire les instances
      if (result && (result as any).result) {
        return (result as any).result;
      }
      
    return result;
    } catch (error: any) {
      console.error('❌ ProcessInstanceService: Erreur lors de la récupération des instances:', error);
      throw error;
    }
  }

  async getProcessInstanceVariables(containerId: string, processInstanceId: number, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/variables`).toPromise();
    return result || {};
    } catch (error: any) {
      console.error('❌ ProcessInstanceService: Erreur lors de la récupération des variables:', error);
      throw error;
    }
  }

  async displayOneProcessInstanceDetail(containerId: string, processInstanceId: number, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/processes/instances/${processInstanceId}`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ ProcessInstanceService: Erreur lors de la récupération des détails:', error);
      throw error;
    }
  }

  async createOneProcessInstance(containerId: string, processId: string, bodyJSON: any = {}, headers?: any): Promise<number> {
    try {
      const result = await this.http.post(`${this.apiUrl}server/containers/${containerId}/processes/${processId}/instances`, bodyJSON).toPromise();
      return result as number;
    } catch (error: any) {
      console.error('❌ ProcessInstanceService: Erreur lors de la création de l\'instance:', error);
      throw error;
    }
  }
} 