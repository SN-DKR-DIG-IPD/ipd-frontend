import { Timestamp } from "./timestamp";

type TaskSummary= {
    "task-id": number;
    "task-name": string;
    "task-subject": string;
    "task-description": string;
    "task-status": "Ready";
    "task-priority": number;
    "task-is-skipable": boolean;
    "task-actual-owner": string;
    "task-created-by": string;
    "task-created-on": Timestamp;
    "task-activation-time": Timestamp;
    "task-expiration-time": Timestamp;
    "task-proc-inst-id": number;
    "task-proc-def-id": string;
    "task-container-id": string;
    "task-parent-id": number;
    "correlation-key": string|number;
    "process-type": string|number;
};

export type { TaskSummary };