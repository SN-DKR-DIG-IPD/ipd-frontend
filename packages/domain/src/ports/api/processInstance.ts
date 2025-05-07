import { ProcessInstanceType } from "../../types/process-instance";
import { UserTasks } from "../../types/user-tasks";
import { WorkItemInstances } from "../../types/work-item-instances";

interface IProcessInstanceAPI {
    displayOneProcessInstanceDetail(containerId : string, processInstanceId : number, headers?: HeadersInit) : Promise<ProcessInstanceType>
    createOneProcessInstance(containerId : string, processId : string, bodyJSON: Object, headers?: HeadersInit) : Promise<number>
    displayAllTasksOfOneProcessInstance(processInstanceId : number, headers?: HeadersInit) : Promise<UserTasks>
    displayAllWorkitemsOfOneProcessInstance(containerId : string, processInstanceId : number, headers?: HeadersInit): Promise<WorkItemInstances>
}
export type {IProcessInstanceAPI};