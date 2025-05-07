import { TaskInstanceType } from "../../types/task-instance"
import { TaskInstanceEvents } from "../../types/task-instance-events"
import { TaskInstances } from "../../types/task-instances"

interface ITaskAdapter {
    getOneTaskInstanceDetail(baseUrl: string, taskInstanceId: number, headers: HeadersInit) : Promise<TaskInstanceType>
    getAllTasksAsAdmin(baseUrl: string, headers: HeadersInit): Promise<TaskInstances>
    getConnectedUserTasks(baseUrl: string, headers: HeadersInit, status?:string): Promise<TaskInstances>
    getConnectedUserPotentialTasks(baseUrl: string, headers: HeadersInit, status?:string): Promise<TaskInstances>
    getOneTaskInstanceInfo(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceType >
    getOneTaskInstanceEvents(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceEvents>
    getTaskInstancesHavingThisVariable(baseUrl: string, variableName: string, headers: HeadersInit): Promise<TaskInstances>
    putTaskInstanceState(baseUrl: string,  containerId : string, taskInstanceId: number, headers: HeadersInit, state?:string): Promise<string|null>
}
export type {ITaskAdapter};