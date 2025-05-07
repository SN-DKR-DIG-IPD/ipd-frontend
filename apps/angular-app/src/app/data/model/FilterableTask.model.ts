import { Timestamp } from "@jbpm/domain";

export interface FilterableTask {
  'task-id': number;
  'task-status': string;
  'task-priority': number;
  'task-created-on': Timestamp;
  'task-expiration-time': { 'java.util.Date': string };
}
