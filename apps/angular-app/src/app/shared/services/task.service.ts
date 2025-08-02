import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // ✅ CORRIGÉ: Utilise environment (qui lit window.__env)
  private apiUrl = environment.bpmAPIBaseUrl;

  constructor(private http: HttpClient) { }

  // ✅ MÉTHODES OBSERVABLE (nouvelle approche)
  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl + 'queries/tasks/instances/pot-owners');
  }

  getTaskForm(containerId: string, taskId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}containers/${containerId}/forms/tasks/${taskId}/content`,
      { responseType: 'text' }
    );
  }

  // ✅ MÉTHODES PROMISE (compatibilité avec l'existant)
  async getTasksForProcessInstance(processInstanceId: number, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}queries/tasks/instances/process/${processInstanceId}`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  }

  async getUserTasks(headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}queries/tasks/user`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des tâches utilisateur:', error);
      throw error;
    }
  }

  async getUserPotentialTasks(headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}queries/tasks/user/potentials`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des tâches potentielles:', error);
      throw error;
    }
  }

  async getTaskDetails(taskId: number, containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}containers/${containerId}/tasks/${taskId}`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des détails de tâche:', error);
      throw error;
    }
  }

  async getTaskInputVariables(taskId: number, containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}containers/${containerId}/tasks/${taskId}/contents/input`).toPromise();
      return result || {};
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des variables d\'entrée:', error);
      throw error;
    }
  }

  async getTaskOutputVariables(taskId: number, containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}containers/${containerId}/tasks/${taskId}/contents/output`).toPromise();
      return result || {};
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des variables de sortie:', error);
      throw error;
    }
  }

  async calculateTaskCompletionRate(processInstanceId: number, headers?: any): Promise<number> {
    try {
      const tasks = await this.getTasksForProcessInstance(processInstanceId, headers);
      if (!tasks || !Array.isArray(tasks)) {
        return 0;
      }
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task['task-status'] === 'Completed').length;
      
      return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors du calcul du taux de complétion:', error);
      return 0;
    }
  }

  async completeTask(taskId: number, containerId: string, data: any = {}, headers?: any): Promise<void> {
    try {
      await this.http.put(`${this.apiUrl}containers/${containerId}/tasks/${taskId}/states/completed`, data).toPromise();
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la complétion de la tâche:', error);
      throw error;
    }
  }

  async claimTask(taskId: number, containerId: string, userId: string, headers?: any): Promise<void> {
    try {
      await this.http.put(`${this.apiUrl}containers/${containerId}/tasks/${taskId}/states/claimed`, { 'user': userId }).toPromise();
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la réclamation de la tâche:', error);
      throw error;
    }
  }

  async releaseTask(taskId: number, containerId: string, headers?: any): Promise<void> {
    try {
      await this.http.put(`${this.apiUrl}containers/${containerId}/tasks/${taskId}/states/released`, {}).toPromise();
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la libération de la tâche:', error);
      throw error;
    }
  }

  async getTaskFormHtml(taskId: number, containerId: string): Promise<string> {
    try {
      const result = await this.http.get(
        `${this.apiUrl}containers/${containerId}/forms/tasks/${taskId}/content`,
        { responseType: 'text' }
      ).toPromise();
      return result as string;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération du formulaire HTML:', error);
      throw error;
    }
  }
} 