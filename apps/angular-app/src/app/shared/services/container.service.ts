import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  // ✅ CORRIGÉ: Utilise environment (qui lit window.__env)
  private apiUrl = environment.bpmAPIBaseUrl;

  constructor(private http: HttpClient) { 
    // Debug: Vérifier la configuration
    console.log('🔍 ContainerService - environment:', environment);
    console.log('🔍 ContainerService - apiUrl:', this.apiUrl);
  }

  // ✅ MÉTHODES OBSERVABLE (nouvelle approche)
  getContainers(): Observable<any> {
    console.log('🔍 ContainerService: Récupération des containers depuis:', this.apiUrl + 'containers');
    return this.http.get(this.apiUrl + 'containers');
  }

  getProcesses(containerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}containers/${containerId}/processes`);
  }

  // ✅ MÉTHODES PROMISE (compatibilité avec l'existant)
  async listContainers(): Promise<any[]> {
    console.log('🔍 ContainerService: Récupération des containers depuis:', this.apiUrl + 'containers');
    
    try {
      const result = await this.http.get(this.apiUrl + 'containers').toPromise();
      console.log('✅ ContainerService: Containers récupérés:', result);
      
      if (!result) {
        console.warn('ContainerService: Réponse vide reçue');
        return [];
      }
      
      const containers: any[] = [];
      if (result && (result as any).result && (result as any).result['kie-containers']) {
        const kieContainers = (result as any).result['kie-containers']['kie-container'];
        
        if (Array.isArray(kieContainers)) {
          for (const container of kieContainers) {
            containers.push({
              'container-id': container['container-id'],
              'container-alias': container['container-alias'],
              'status': container['status'],
            });
          }
        } else if (kieContainers) {
          containers.push({
            'container-id': kieContainers['container-id'],
            'container-alias': kieContainers['container-alias'],
            'status': kieContainers['status'],
          });
        }
      }
      
      console.log('✅ ContainerService: Containers traités:', containers.length);
      return containers;
    } catch (error: any) {
      console.error('❌ ContainerService: Erreur lors de la récupération des containers:', error);
      throw error;
    }
  }

  async displayAllProcesses(containerId: string, headers?: any): Promise<any> {
    console.log('🔍 ContainerService: Récupération des processus pour container:', containerId);
    
    try {
      const result = await this.http.get(`${this.apiUrl}containers/${containerId}/processes`).toPromise();
      console.log('✅ ContainerService: Processus récupérés:', result);
      
      const resultAny = result as any;
      return { processes: resultAny?.processes || resultAny?.['process-definition'] || [] };
    } catch (error: any) {
      console.error('❌ ContainerService: Erreur lors de la récupération des processus:', error);
      throw error;
    }
  }

  async getProcessDefinitions(containerId: string, headers?: any): Promise<any[]> {
    try {
      const result = await this.http.get(`${this.apiUrl}containers/${containerId}/processes`).toPromise();
      const resultAny = result as any;
      return resultAny?.processes || [];
    } catch (error: any) {
      console.error('❌ ContainerService: Erreur lors de la récupération des définitions de processus:', error);
      throw error;
    }
  }
} 