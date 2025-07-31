import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContainerService {
  private apiUrl = '/jbpm/api'; // À adapter selon la config env

  constructor(private http: HttpClient) {}

  async listContainers(): Promise<any[]> {
    console.log('ContainerService: Récupération de la liste des containers...');
    console.log('ContainerService: URL appelée:', `${this.apiUrl}/containers`);
    
    try {
      // Laisser l'intercepteur gérer l'authentification
      let httpHeaders = new HttpHeaders().set('Accept', 'application/json');
      
      // Récupère la réponse en JSON
      const result = await this.http.get(
      `${this.apiUrl}/containers`,
      { headers: httpHeaders }
    ).toPromise();
      
      console.log('ContainerService: Réponse brute reçue:', result);
      console.log('ContainerService: Type de réponse:', typeof result);
      
      if (!result) {
        console.warn('ContainerService: Réponse vide reçue');
        return [];
      }
      
      // Traiter la réponse JSON
      const containers: any[] = [];
      
      if (result && (result as any).result && (result as any).result['kie-containers']) {
        const kieContainers = (result as any).result['kie-containers']['kie-container'];
        
        if (Array.isArray(kieContainers)) {
          // Plusieurs containers
          for (const container of kieContainers) {
            const containerInfo = {
              'container-id': container['container-id'],
              'container-alias': container['container-alias'],
              'status': container['status'],
            };
            containers.push(containerInfo);
            console.log('ContainerService: Container trouvé:', containerInfo);
          }
        } else if (kieContainers) {
          // Un seul container
          const containerInfo = {
            'container-id': kieContainers['container-id'],
            'container-alias': kieContainers['container-alias'],
            'status': kieContainers['status'],
          };
          containers.push(containerInfo);
          console.log('ContainerService: Container trouvé:', containerInfo);
        }
      }
      
      console.log('ContainerService: Containers trouvés:', containers.length);
      return containers;
      
    } catch (error: any) {
      console.error('ContainerService: Erreur lors de la récupération des containers:', error);
      console.error('ContainerService: Détails de l\'erreur:', {
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText,
        url: error?.url
      });
      throw error;
    }
  }

  private buildHeaders(headers?: HeadersInit): HttpHeaders {
    let httpHeaders = new HttpHeaders({ 'Accept': 'application/json' });
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value as string);
      });
    }
    return httpHeaders;
  }

  async displayAllProcesses(containerId: string, headers?: HeadersInit): Promise<any> {
    let httpHeaders = new HttpHeaders({ 'Accept': 'application/json' });
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value as string);
      });
    }
    
    console.log('🔍 ContainerService - URL pour les processus:', `${this.apiUrl}/containers/${containerId}/processes`);
    
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/processes`,
      { headers: httpHeaders }
    ).toPromise();
    
    console.log('🔍 ContainerService - Réponse processus:', result);
    
    return { processes: result['processes'] || result['process-definition'] || [] };
  }

  /**
   * Récupère la liste des modèles de processus (process definitions) pour un container donné
   */
  async getProcessDefinitions(containerId: string, headers?: HeadersInit): Promise<any[]> {
    let httpHeaders = new HttpHeaders({ 'Accept': 'application/json' });
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value as string);
      });
    }
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/processes`,
      { headers: httpHeaders }
    ).toPromise();
    return result.processes || [];
  }
} 