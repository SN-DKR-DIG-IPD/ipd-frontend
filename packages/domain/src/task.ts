import { IDefaultConfigAPI, ITaskAPI } from "./ports/api";
import { ITaskAdapter } from "./ports/spi";
import { TaskInstanceEvents, TaskInstances } from "./types";
import { TaskInstanceType } from "./types/task-instance";

class Task implements ITaskAPI {
	defaultConfig: IDefaultConfigAPI
	taskAdapter: ITaskAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		taskAdapter: ITaskAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.taskAdapter = taskAdapter;
	}

	displayOneTaskInstanceDetail(taskInstanceId: number,  headers = this.defaultConfig.getDefaultHeaders()): Promise<TaskInstanceType> {
		return this.taskAdapter.getOneTaskInstanceDetail(this.defaultConfig.getAPIBaseUrl(), taskInstanceId, headers)
	}

	displayAllTasksAsAdmin(headers = this.defaultConfig.getDefaultHeaders()): Promise<TaskInstances> {
		return this.taskAdapter.getAllTasksAsAdmin(this.defaultConfig.getAPIBaseUrl(), headers)
	}

	displayConnectedUserTasks(headers = this.defaultConfig.getDefaultHeaders(), status?:string): Promise<TaskInstances> {
		if(status){
			return this.taskAdapter.getConnectedUserTasks(this.defaultConfig.getAPIBaseUrl(), headers, status)
		}
		else{
			return this.taskAdapter.getConnectedUserTasks(this.defaultConfig.getAPIBaseUrl(), headers)
		}
	}
	
	displayConnectedUserPotentialTasks(headers = this.defaultConfig.getDefaultHeaders(), status?:string): Promise<TaskInstances> {
		if(status){
			return this.taskAdapter.getConnectedUserPotentialTasks(this.defaultConfig.getAPIBaseUrl(), headers, status)
		}
		else{
			return this.taskAdapter.getConnectedUserPotentialTasks(this.defaultConfig.getAPIBaseUrl(), headers)
		}
	}

	displayOneTaskInstanceInfo(taskInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<TaskInstanceType> {
		return this.taskAdapter.getOneTaskInstanceInfo(this.defaultConfig.getAPIBaseUrl(), taskInstanceId, headers)
	}
	displayOneTaskInstanceEvents(taskInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<TaskInstanceEvents> {
		return this.taskAdapter.getOneTaskInstanceEvents(this.defaultConfig.getAPIBaseUrl(), taskInstanceId, headers)
	}
	displayTaskInstancesHavingThisVariable(variableName: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<TaskInstances> {
		return this.taskAdapter.getTaskInstancesHavingThisVariable(this.defaultConfig.getAPIBaseUrl(), variableName, headers)
	}
	alterTaskInstanceState(containerId: string, taskInstanceId: number, headers = this.defaultConfig.getDefaultHeaders(), state?:string): Promise<string|null> {
		if(state){
			return this.taskAdapter.putTaskInstanceState(this.defaultConfig.getAPIBaseUrl(), containerId, taskInstanceId, headers, state)
		}
		else{
			return this.taskAdapter.putTaskInstanceState(this.defaultConfig.getAPIBaseUrl(), containerId, taskInstanceId, headers)
		}
	}
}

export { Task };
