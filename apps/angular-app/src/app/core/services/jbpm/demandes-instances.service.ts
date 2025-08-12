import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { normalizeInstanceState, toDate, JbpmInstanceState } from '../../helpers/jbpm-normalize';

export interface InstanceVM {
  processInstanceId: number;
  processId: string;
  containerId: string;
  state: JbpmInstanceState;
  initiator: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface ListInstancesParams {
  initiator?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class DemandesInstancesService {
  private base = environment.bpmAPIBaseUrl;
  constructor(private http: HttpClient) {}

  list(params: ListInstancesParams = {}): Observable<InstanceVM[]> {
    let hp = new HttpParams()
      .set('page', String(params.page ?? 0))
      .set('pageSize', String(params.pageSize ?? 50))
      .set('sortOrder', (params.sortOrder ?? 'desc'));
    if (params.initiator) hp = hp.set('initiator', params.initiator);

    const url = `${this.base}server/queries/processes/instances`;
    return this.http.get<any>(url, { params: hp }).pipe(
      map(res => (res?.['process-instance'] ?? res ?? []) as any[]),
      map(list => list.map((pi: any) => ({
        processInstanceId: Number(pi['process-instance-id']) || 0,
        processId: String(pi['process-id'] || ''),
        containerId: String(pi['container-id'] || ''),
        state: normalizeInstanceState(pi['process-instance-state']),
        initiator: String(pi['initiator'] || pi['process-instance-initiator'] || ''),
        startDate: toDate(pi['start-date']),
        endDate: toDate(pi['end-date'])
      }) as InstanceVM))
    );
  }
}


