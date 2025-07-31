import { Injectable, Inject } from '@angular/core';
import { DiagramAPI } from '../../injections';
import { IDiagramAPI } from '@jbpm/domain';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  constructor(@Inject(DiagramAPI) private diagramAPI: IDiagramAPI) {}

  async getProcessInstanceDiagram(containerId: string, processInstanceId: number, headers: any): Promise<string> {
    try {
      console.log('🔍 DiagramService - Paramètres:', { containerId, processInstanceId, headers });
      
      // Récupérer l'URL de base depuis l'environnement
      const baseUrl = (window as any).__env?.bpmAPIBaseUrl || '/jbpm/api';
      console.log('🔍 DiagramService - URL de base:', baseUrl);
      
      const result = await this.diagramAPI.getProcessInstanceDiagram(containerId, processInstanceId, headers);
      console.log('✅ DiagramService - Résultat récupéré, longueur:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du diagramme:', error);
      throw error;
    }
  }

  async getProcessDiagram(containerId: string, processId: string, headers: any): Promise<string> {
    try {
      console.log('🔍 DiagramService - getProcessDiagram - Paramètres:', { containerId, processId, headers });
      
      const result = await this.diagramAPI.getProcessDiagram(containerId, processId, headers);
      console.log('✅ DiagramService - getProcessDiagram - Résultat récupéré, longueur:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du diagramme de processus:', error);
      throw error;
    }
  }
} 