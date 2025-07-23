import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProcessInstanceAPI } from '@domain/ports/api/processInstance';
import { ProcessInstanceType } from '@domain/types/process-instance';
import { UserTasks } from '@domain/types/user-tasks';
import { WorkItemInstances } from '@domain/types/work-item-instances';
import { ProcessInstances } from '@domain/types/process-instances';
import { TaskService } from './task.service';

@Injectable({ providedIn: 'root' })
export class ProcessInstanceService implements IProcessInstanceAPI {
  private apiUrl = '/jbpm/api'; // À adapter selon la config env

  constructor(
    private http: HttpClient,
    private taskService: TaskService
  ) {}

  async displayOneProcessInstanceDetail(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<ProcessInstanceType> {
    const result = await this.http.get<ProcessInstanceType>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    if (!result) throw new Error('Aucun détail de processus retourné par l’API');
    return result;
  }

  async createOneProcessInstance(containerId: string, processId: string, bodyJSON: Object, headers?: HeadersInit): Promise<number> {
    const result = await this.http.post<number>(
      `${this.apiUrl}/containers/${containerId}/processes/${processId}/instances`,
      bodyJSON,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    if (typeof result !== 'number') {
      throw new Error('L’API n’a pas retourné d’ID de processus valide');
    }
    return result;
  }

  async displayAllTasksOfOneProcessInstance(processInstanceId: number, headers?: HeadersInit): Promise<UserTasks> {
    return await this.taskService.getTasksForProcessInstance(processInstanceId, headers);
  }

  async displayAllWorkitemsOfOneProcessInstance(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<WorkItemInstances> {
    const result = await this.http.get<WorkItemInstances>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/workitems`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    if (!result) throw new Error('Aucun workitem retourné par l’API');
    return result;
  }

  async getAllProcessInstances(containerId: string, headers?: HeadersInit): Promise<ProcessInstances> {
    const result = await this.http.get<ProcessInstances>(
      `${this.apiUrl}/containers/${containerId}/processes/instances`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    if (!result) throw new Error('Aucune instance de processus retournée par l’API');
    return result;
  }

  /**
   * Get process instance with completion rate
   */
  async getProcessInstanceWithCompletionRate(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<ProcessInstanceType & { tauxCompletu?: number }> {
    const processInstance = await this.displayOneProcessInstanceDetail(containerId, processInstanceId, headers);
    const completionRate = await this.taskService.calculateTaskCompletionRate(processInstanceId, headers);
    
    return {
      ...processInstance,
      tauxCompletu: completionRate
    };
  }

  /**
   * Abort a process instance
   */
  async abortProcessInstance(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<void> {
    await this.http.delete<void>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Get process instance variables
   */
  async getProcessInstanceVariables(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/variables`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result || {};
  }

  /**
   * Set process instance variable
   */
  async setProcessInstanceVariable(containerId: string, processInstanceId: number, variableName: string, value: any, headers?: HeadersInit): Promise<void> {
    await this.http.put<void>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/variables/${variableName}`,
      { value },
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Get process instance history
   */
  async getProcessInstanceHistory(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<any[]> {
    const result = await this.http.get<any[]>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/nodes/instances`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result || [];
  }

  /**
   * Get process instance SLA information
   */
  async getProcessInstanceSLA(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<any> {
    const result = await this.http.get<any>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/slas`,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
    
    return result || {};
  }

  /**
   * Trigger signal on process instance
   */
  async triggerSignal(containerId: string, processInstanceId: number, signalName: string, data: any = {}, headers?: HeadersInit): Promise<void> {
    await this.http.post<void>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/signal/${signalName}`,
      data,
      { headers: this.buildHeaders(headers) }
    ).toPromise();
  }

  /**
   * Get process instance diagram
   */
  async getProcessInstanceDiagram(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<string> {
    const result = await this.http.get<string>(
      `${this.apiUrl}/containers/${containerId}/processes/instances/${processInstanceId}/diagram`,
      { 
        headers: this.buildHeaders(headers),
        responseType: 'text' as 'json'
      }
    ).toPromise();
    
    return result || '';
  }

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