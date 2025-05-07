import { Timestamp } from "./timestamp";

type TaskInstance= {
    "task-id": number;
    "task-type": string;
    "task-form": string;
    "task-name": string;
    "task-subject": string;
    "task-description": string;
    "task-status": "Ready"| "Completed" | "Unknow";
    "task-priority": number;
    "task-is-skipable": boolean;
    "task-workitem-id": number;
    "task-proc-inst-id" : number,
    "task-actual-owner": string;
    "task-created-by"?: string;
    "task-created-on": Timestamp;
    "task-activation-time"?: Timestamp;
    "task-expiration-time"?: Timestamp;
    "task-proc-def-id": string;
    "task-container-id": string;
    "task-parent-id": number;
    "task-process-id" : string;
    "correlation-key": string|number;
    "process-type": string|number;
    "sla-compliance" : string;
    "sla-due-date" : Timestamp;
    "task-pot-owners" : string;
    "task-excl-owners" : string;
    "task-business-admins" : string[];
    "task-input-data" : string[];
    "task-output-data" : string[];
};

export type { TaskInstance as TaskInstanceType };