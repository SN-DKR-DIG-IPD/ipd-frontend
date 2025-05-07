import { IDefaultConfigAPI, IWorkItemsAPI } from "./ports/api";
import { IWorkItemsAdapter } from "./ports/spi";
import { WorkItemInstance } from "./types";

class WorkItems implements IWorkItemsAPI {
	defaultConfig: IDefaultConfigAPI
	workItemsAdapter: IWorkItemsAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		workItemsAdapter: IWorkItemsAdapter
	) {
		this.defaultConfig = defaultConfig
		this.workItemsAdapter = workItemsAdapter;
	}

	async displayWorkitemInfo(containerId: string, processInstanceId: number, workItemId: number,  headers = this.defaultConfig.getDefaultHeaders()): Promise<WorkItemInstance> {
		return this.workItemsAdapter.getWorkitemInfo(this.defaultConfig.getAPIBaseUrl(), containerId, processInstanceId, workItemId, headers)
	}

	async completeWorkItemOfProcessInstance(containerId: string, processInstanceId: number, workItemId: number, bodyJSON: Object,  headers = this.defaultConfig.getDefaultHeaders()): Promise<number> {
		return this.workItemsAdapter.completeWorkItemOfProcessInstance(this.defaultConfig.getAPIBaseUrl(), containerId, processInstanceId, workItemId, bodyJSON, headers)
	}
}

export { WorkItems };
