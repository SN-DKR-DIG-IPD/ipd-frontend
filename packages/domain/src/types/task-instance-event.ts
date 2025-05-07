import { Timestamp } from "./timestamp";

type TaskInstanceEvent= {
    "task-event-id" : number;
    "task-id" : number;
    "task-event-type" : "ADDED";
    "task-event-user" : string;
    "task-event-date" : Timestamp,
    "task-process-instance-id" : number;
    "task-work-item-id" : number;
    "task-event-message" : null,
    "correlation-key" : string,
    "process-type" :number;
    "assigned-owner" : string;
};

export type { TaskInstanceEvent };