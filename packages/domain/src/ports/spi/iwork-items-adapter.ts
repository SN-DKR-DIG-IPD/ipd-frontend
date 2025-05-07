import { WorkItemInstance } from "../../types/work-item-instance";

interface IWorkItemsAdapter {
    getWorkitemInfo(baseUrl: string, containerId: string, processInstanceId: number, workItemId: number, headers: HeadersInit): Promise<WorkItemInstance>
    completeWorkItemOfProcessInstance(baseUrl: string, containerId: string ,processInstanceId: number, workItemId: number, bodyJSON: Object, headers: HeadersInit): Promise<number>
}
export type {IWorkItemsAdapter};