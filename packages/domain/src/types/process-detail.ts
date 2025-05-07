import { objectType } from "./object-type";
import {Node} from "./node"

type ProcessDetail= {
    associatedEntities: {[key:string]:string[] };
    serviceTasks: objectType;
    processVariables: {[key:string]:string};
    reusableSubProcesses: [];
    nodes: Node[];
    timers: [];
    tagsByVariable: {[key:string]:[]};
    "process-id": string;
    "process-name": string;
    "process-version": string;
    "package": string;
    "container-id": string;
    dynamic: boolean;
};

export type { ProcessDetail};