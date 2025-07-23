import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = '/jbpm/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks for a process instance (jbpmPortal compatible)
   */
  async getTasksForProcessInstance(processInstanceId: number, headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/queries/tasks/instances/process/${processInstanceId}`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    if (!result) {
      throw new Error('Aucune tâche retournée par l\'API');
    }
    return result;
  }

  /**
   * Get task details by ID
   */
  async getTaskDetails(taskId: number, containerId: string, headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    if (!result) {
      throw new Error('Aucun détail de tâche retourné par l\'API');
    }
    return result;
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: number, containerId: string, data: any = {}, headers?: HeadersInit): Promise<void> {
    await this.http.post<void>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/states/completed`,
      data,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Claim a task
   */
  async claimTask(taskId: number, containerId: string, userId: string, headers?: HeadersInit): Promise<void> {
    await this.http.put<void>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/states/claimed`,
      { 'user': userId },
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Release a task
   */
  async releaseTask(taskId: number, containerId: string, headers?: HeadersInit): Promise<void> {
    await this.http.put<void>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/states/released`,
      {},
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Skip a task
   */
  async skipTask(taskId: number, containerId: string, headers?: HeadersInit): Promise<void> {
    await this.http.put<void>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/states/skipped`,
      {},
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Get task form content
   */
  async getTaskForm(taskId: number, containerId: string, headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/contents/input`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result;
  }

  /**
   * Submit task form
   */
  async submitTaskForm(taskId: number, containerId: string, formData: any, headers?: HeadersInit): Promise<void> {
    await this.http.post<void>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/contents/output`,
      formData,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Get task comments
   */
  async getTaskComments(taskId: number, containerId: string, headers?: HeadersInit): Promise<any[]> {
    const result = await this.http.get<any[]>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/comments`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result || [];
  }

  /**
   * Add comment to task
   */
  async addTaskComment(taskId: number, containerId: string, comment: string, headers?: HeadersInit): Promise<any> {
    const result = await this.http.post<any>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/comments`,
      { 'text': comment },
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result;
  }

  /**
   * Get task attachments
   */
  async getTaskAttachments(taskId: number, containerId: string, headers?: HeadersInit): Promise<any[]> {
    const result = await this.http.get<any[]>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/attachments`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result || [];
  }

  /**
   * Upload attachment to task
   */
  async uploadTaskAttachment(taskId: number, containerId: string, file: File, headers?: HeadersInit): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await this.http.post<any>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/attachments`,
      formData,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result;
  }

  /**
   * Calculate task completion rate
   */
  async calculateTaskCompletionRate(processInstanceId: number, headers?: HeadersInit): Promise<number> {
    try {
      const tasks = await this.getTasksForProcessInstance(processInstanceId, headers);
      const taskList = tasks['task-summary'] || [];
      const total = taskList.length;
      const completed = taskList.filter((task: any) => 
        task['task-status'] === 'Completed' || task['task-status'] === 'Terminé'
      ).length;
      
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    } catch (error) {
      console.warn(`Erreur lors du calcul du taux de complétude pour l'instance ${processInstanceId}:`, error);
      return 0;
    }
  }

  /**
   * Récupère le HTML du formulaire jBPM pour une tâche utilisateur (méthode jbpmPortal)
   */
  async getTaskFormHtml(taskId: number, containerId: string): Promise<string> {
    const headers = { Accept: 'text/html' };
    return await this.http.get(
      `/jbpm/api/containers/${containerId}/forms/tasks/${taskId}/content`,
      { headers, responseType: 'text' as 'json' }
    ).toPromise() as Promise<string>;
  }

  /**
   * Récupère les variables d'entrée d'une tâche utilisateur (pour génération dynamique de formulaire)
   */
  async getTaskInputVariables(taskId: number, containerId: string, headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/tasks/${taskId}/contents/input`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    return result;
  }

  /**
   * Récupère toutes les tâches attribuées à l'utilisateur connecté ou à ses groupes (inbox)
   */
  async getUserTasks(headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/queries/tasks/user`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    if (!result) {
      throw new Error('Aucune tâche utilisateur retournée par l\'API');
    }

    // Filtrer les tâches selon le groupe de l'utilisateur
    const taskList = result['task-summary'] || [];
    // const filteredTasks = this.userService.filterTasksByUserGroup(taskList); // Removed UserService dependency
    
    console.log('Tâches filtrées selon le groupe utilisateur:', taskList);
    
    return {
      ...result,
      'task-summary': taskList
    };
  }

  /**
   * Récupère toutes les tâches où l'utilisateur connecté est potential owner (via groupe/role)
   */
  async getUserPotentialTasks(headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/queries/tasks/user/potentials`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    if (!result) {
      throw new Error('Aucune tâche potential owner retournée par l\'API');
    }

    // Filtrer les tâches selon le groupe de l'utilisateur
    const taskList = result['task-summary'] || [];
    // const filteredTasks = this.userService.filterTasksByUserGroup(taskList); // Removed UserService dependency
    
    console.log('Tâches potential owner filtrées selon le groupe utilisateur:', taskList);
    
    return {
      ...result,
      'task-summary': taskList
    };
  }

  /**
   * Build headers for API calls
   */
  private buildHeaders(headers?: HeadersInit): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value as string);
      });
    }
    
    return httpHeaders;
  }
} 