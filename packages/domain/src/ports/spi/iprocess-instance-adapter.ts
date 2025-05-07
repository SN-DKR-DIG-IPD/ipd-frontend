import { ProcessInstanceType } from "../../types/process-instance";
import { UserTasks } from "../../types/user-tasks";
import { WorkItemInstances } from "../../types/work-item-instances";

interface IProcessInstanceAdapter {
    getOneProcessInstanceDetail(baseUrl: string, containerId : string, processInstanceId : number, headers: HeadersInit) : Promise<ProcessInstanceType>
    createOneProcessInstance(baseUrl: string, containerId: string, processId: string, bodyJSON: Object, headers: HeadersInit) : Promise<number>
    getAllTasksOfOneProcessInstance(baseUrl: string, processInstanceId : number, headers: HeadersInit) : Promise<UserTasks>
    getAllWorkitemsOfOneProcessInstance(baseUrl: string, containerId : string, processInstanceId : number, headers: HeadersInit): Promise<WorkItemInstances>
}
export type {IProcessInstanceAdapter};
