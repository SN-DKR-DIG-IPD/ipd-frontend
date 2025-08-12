import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, forkJoin, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { normalizeTaskStatus, toDate, JbpmTaskStatus } from '../../helpers/jbpm-normalize';
import { UserContextService } from '../auth/user-context.service';

export interface TaskVM {
  taskId: number;
  name: string;
  processInstanceId: number;
  containerId: string;
  status: JbpmTaskStatus;
  createdOn: Date | null;
  owner: string;
}

export interface ListTasksParams {
  statuses?: string[];
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class DemandesTachesService {
  private base = environment.bpmAPIBaseUrl;
  constructor(private http: HttpClient, private userContext: UserContextService) {}

  list(params: ListTasksParams = {}): Observable<TaskVM[]> {
    return this.listPotOwners(params);
  }

  private mapList(list: any[]): TaskVM[] {
    return list.map((t: any) => ({
      taskId: Number(t['task-id']) || 0,
      name: String(t['task-name'] || ''),
      processInstanceId: Number(t['task-proc-inst-id']) || 0,
      containerId: String(t['task-container-id'] || ''),
      status: normalizeTaskStatus(t['task-status']),
      createdOn: toDate(t['task-created-on'] || t['created-on']),
      owner: String(t['task-actual-owner'] || '')
    }) as TaskVM);
  }

  private buildParams(params: ListTasksParams): HttpParams {
    const statuses = params.statuses ?? ['Ready', 'Reserved', 'InProgress'];
    let hp = new HttpParams()
      .set('page', String(params.page ?? 0))
      .set('pageSize', String(params.pageSize ?? 200));
    statuses.forEach(s => hp = hp.append('status', s));
    return hp;
  }

  listPotOwners(params: ListTasksParams = {}): Observable<TaskVM[]> {
    const url = `${this.base}server/queries/tasks/instances/pot-owners`;
    return this.http.get<any>(url, { params: this.buildParams(params) }).pipe(
      map(res => (res?.['task-summary'] ?? res ?? []) as any[]),
      map(list => this.mapList(list))
    );
  }

  // Fallback: tâches dont l'utilisateur est propriétaire
  listOwners(params: ListTasksParams = {}): Observable<TaskVM[]> {
    const url = `${this.base}server/queries/tasks/instances/owners`;
    return this.http.get<any>(url, { params: this.buildParams(params) }).pipe(
      map(res => (res?.['task-summary'] ?? res ?? []) as any[]),
      map(list => this.mapList(list))
    );
  }

  private getGroups(): string[] {
    const groups = this.userContext.getGroups();
    return Array.isArray(groups) ? groups.filter(Boolean) : [];
  }

  // Potential owners par groupes (rôles/GroupId)
  listPotOwnersByGroups(params: ListTasksParams = {}): Observable<TaskVM[]> {
    const groups = this.getGroups();
    if (groups.length === 0) return of([]);

    const url = `${this.base}server/queries/tasks/instances/pot-owners`;
    let hp = this.buildParams(params);
    // jBPM attend groups répétés: &groups=A&groups=B
    groups.forEach(g => hp = hp.append('groups', g));
    console.debug('[JBPM] pot-owners by groups', { url, groups, params: hp.toString() });
    return this.http.get<any>(url, { params: hp }).pipe(
      map(res => (res?.['task-summary'] ?? res ?? []) as any[]),
      map(list => this.mapList(list))
    );
  }

  // Combine pot-owners + owners and deduplicate by taskId
  listCombined(params: ListTasksParams = {}): Observable<TaskVM[]> {
    const p = { ...params, pageSize: params.pageSize ?? 200 };
    return forkJoin([
      this.listPotOwners(p),
      this.listPotOwnersByGroups(p),
      this.listOwners(p)
    ]).pipe(
      map(([pot, byGroups, owners]) => {
        const combined = [...pot, ...byGroups, ...owners] as TaskVM[];
        const byId = new Map<number, TaskVM>();
        combined.forEach(t => byId.set(t.taskId, t));
        return Array.from(byId.values()).sort((a, b) => {
          const ta = (a.createdOn ? new Date(a.createdOn).getTime() : 0);
          const tb = (b.createdOn ? new Date(b.createdOn).getTime() : 0);
          return tb - ta;
        });
      })
    );
  }
}


