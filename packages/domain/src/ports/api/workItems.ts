import { WorkItemInstance } from "../../types/work-item-instance";

interface IWorkItemsAPI {
    displayWorkitemInfo(containerId:string, processInstanceId: number, workItemId: number, headers?: HeadersInit): Promise<WorkItemInstance>
    completeWorkItemOfProcessInstance(containerId:string, processInstanceId: number, workItemId: number,  bodyJSON: Object, headers?: HeadersInit): Promise<number>
}
export type {IWorkItemsAPI};