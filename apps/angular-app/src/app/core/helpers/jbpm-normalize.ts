export type JbpmInstanceState = 'Active' | 'Completed' | 'Aborted' | 'Suspended' | 'Error' | 'Unknown';
export type JbpmTaskStatus = 'Ready' | 'Reserved' | 'InProgress' | 'Completed' | 'Exited' | 'Failed' | 'Error' | 'Obsolete';

const INSTANCE_STATE_MAP: Record<string, JbpmInstanceState> = {
  '1': 'Active',
  '2': 'Completed',
  '3': 'Aborted',
  '4': 'Suspended',
  '5': 'Error'
};

export function normalizeInstanceState(val: any): JbpmInstanceState {
  if (val == null) return 'Unknown';
  const s = String(val);
  return INSTANCE_STATE_MAP[s] || (['Active','Completed','Aborted','Suspended','Error'].includes(s) ? (s as JbpmInstanceState) : 'Unknown');
}

export function normalizeTaskStatus(val: any): JbpmTaskStatus {
  const s = String(val || '').trim();
  const allowed: JbpmTaskStatus[] = ['Ready','Reserved','InProgress','Completed','Exited','Failed','Error','Obsolete'];
  return (allowed.includes(s as JbpmTaskStatus) ? (s as JbpmTaskStatus) : 'Ready');
}

export function toDate(val: any): Date | null {
  if (!val) return null;
  if (val['java.util.Date']) return new Date(val['java.util.Date']);
  if (val.timestamp) return new Date(val.timestamp);
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}


