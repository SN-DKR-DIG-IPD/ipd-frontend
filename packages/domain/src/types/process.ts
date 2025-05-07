import { AssociatedEntity } from "./associated-entity";
import { Node } from "./node";
import { ProcessVariables } from "./process-variables";
import { ReusableSubProcess } from "./reusable-sub-process";
import { ServiceTask } from "./service-task";
import { Timer } from "./timer";

type ProcessType = {
    associatedEntities: AssociatedEntity[],
    serviceTasks: ServiceTask[],
    processVariables: ProcessVariables,
    reusableSubProcesses: ReusableSubProcess[],
    nodes: Node[],
    timers: Timer[],
    tagsByVariable: null,
    "process-id": string,
    "process-name": string,
    "process-version": string,
    package: string,
    "container-id": string,
    dynamic: boolean
};

export type { ProcessType };