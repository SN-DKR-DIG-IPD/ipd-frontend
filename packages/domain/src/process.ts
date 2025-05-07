import { IDefaultConfigAPI, IProcessAPI } from "./ports/api";
import { IProcessAdapter } from "./ports/spi";
import { ProcessDetail, ProcessInstances, ProcessInstanceType, ProcessVariables, UserTasks, WorkItemInstances } from "./types";

class Process implements IProcessAPI {
	defaultConfig: IDefaultConfigAPI
	processAdapter: IProcessAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		processAdapter: IProcessAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.processAdapter = processAdapter;
	}

	displayOneProcessDetail(containerId: string, processId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<ProcessDetail> {
		return this.processAdapter.getOneProcessDetail(this.defaultConfig.getAPIBaseUrl(), containerId, processId, headers)
	}

	displayOneProcessVariables(containerId: string, processId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<ProcessVariables> {
		return this.processAdapter.getOneProcessVariables(this.defaultConfig.getAPIBaseUrl(), containerId, processId, headers)
	}

	displayAllInstancesOfOneProcess(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<ProcessInstances> {
		return this.processAdapter.getAllInstancesOfOneProcess(this.defaultConfig.getAPIBaseUrl(), containerId, headers)
	}
}

export { Process };
