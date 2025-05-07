import { TaskInstanceType } from "../../types/task-instance"
import { TaskInstanceEvents } from "../../types/task-instance-events"
import { TaskInstances } from "../../types/task-instances"

interface ITaskAPI {
    displayOneTaskInstanceDetail(taskInstanceId: number, headers?: HeadersInit) : Promise<TaskInstanceType>
    displayAllTasksAsAdmin(headers?: HeadersInit): Promise<TaskInstances>
    displayConnectedUserTasks(headers?: HeadersInit, status?:string): Promise<TaskInstances>
    displayConnectedUserPotentialTasks(headers?: HeadersInit, status?:string): Promise<TaskInstances>
    displayOneTaskInstanceInfo(taskInstanceId: number, headers?: HeadersInit): Promise<TaskInstanceType> 
    displayOneTaskInstanceEvents(taskInstanceId: number, headers?: HeadersInit): Promise<TaskInstanceEvents>
    displayTaskInstancesHavingThisVariable(variableName: string, headers?: HeadersInit): Promise<TaskInstances>
    alterTaskInstanceState(containerId : string, taskInstanceId: number, headers?: HeadersInit, state?:string): Promise<string|null>
}
export type {ITaskAPI};