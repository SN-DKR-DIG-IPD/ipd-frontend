import { IDefaultConfigAPI, IProcessInstanceAPI } from "./ports/api";
import { IProcessInstanceAdapter } from "./ports/spi";
import { ProcessInstanceType, UserTasks, WorkItemInstances } from "./types";

class ProcessInstance implements IProcessInstanceAPI {
	defaultConfig: IDefaultConfigAPI
	processInstanceAdapter: IProcessInstanceAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		processInstanceAdapter: IProcessInstanceAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.processInstanceAdapter = processInstanceAdapter;
	}
	displayOneProcessInstanceDetail(containerId: string, processInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<ProcessInstanceType> {
		return this.processInstanceAdapter.getOneProcessInstanceDetail(this.defaultConfig.getAPIBaseUrl(), containerId, processInstanceId, headers)
	}

	createOneProcessInstance(containerId: string, processId: string, bodyJSON: Object, headers = this.defaultConfig.getDefaultHeaders()): Promise<number> {
		return this.processInstanceAdapter.createOneProcessInstance(this.defaultConfig.getAPIBaseUrl(), containerId, processId, bodyJSON, headers)
	}

	displayAllTasksOfOneProcessInstance(processInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<UserTasks> {
		return this.processInstanceAdapter.getAllTasksOfOneProcessInstance(this.defaultConfig.getAPIBaseUrl(), processInstanceId, headers)	}

	displayAllWorkitemsOfOneProcessInstance(containerId: string, processInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<WorkItemInstances> {
		return this.processInstanceAdapter.getAllWorkitemsOfOneProcessInstance(this.defaultConfig.getAPIBaseUrl(), containerId, processInstanceId, headers)
	}
}

export { ProcessInstance };
