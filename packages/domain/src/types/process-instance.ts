import { UserTasks } from "./user-tasks";
import { ProcessInstanceVariables } from "./process-instance-variables";
import { Timestamp } from "./timestamp";

type ProcessInstance= {
    "process-instance-id": number;
    "process-id": string;
    "process-name": string;
    "process-version": string;
    "process-instance-state": number;
    "container-id": string;
    "initiator": string;
    "start-date": Timestamp;
    "process-instance-desc": string;
    "correlation-key": string;
    "parent-instance-id": number;
    "sla-compliance": number;
    "sla-due-date": Timestamp;
    "active-user-tasks": UserTasks;
    "process-instance-variables": ProcessInstanceVariables;
};

export type { ProcessInstance as ProcessInstanceType };