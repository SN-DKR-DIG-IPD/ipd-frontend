import { WorkItemParams } from "./work-item-params";

type WorkItemInstance = {
    "work-item-id" : number;
    "work-item-name" : string;
    "work-item-state" : number;
    "work-item-params" : WorkItemParams;
    "process-instance-id" : number;
    "container-id" : string;
    "node-instance-id" : number;
    "node-id" : number;
};

export type { WorkItemInstance };