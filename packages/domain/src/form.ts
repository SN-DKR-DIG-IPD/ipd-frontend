import { IDefaultConfigAPI, IFormAPI } from "./ports/api";
import { IFormAdapter } from "./ports/spi";

class Form implements IFormAPI {
	defaultConfig: IDefaultConfigAPI
	formAdapter: IFormAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		formAdapter: IFormAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.formAdapter = formAdapter;
	}
	getTaskInstanceForm(containerId: string, taskInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<string> {
		return this.formAdapter.getTaskInstanceForm(this.defaultConfig.getAPIBaseUrl(), containerId, taskInstanceId, headers)
	}

	getCaseDefinitionForm(containerId: string, caseDefId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<string> {
		return this.formAdapter.getCaseDefinitionForm(this.defaultConfig.getAPIBaseUrl(), containerId, caseDefId, headers)
	}

	getProcessDefinitionForm(containerId: string, processId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<string> {
		return this.formAdapter.getProcessDefinitionForm(this.defaultConfig.getAPIBaseUrl(), containerId, processId, headers)
	}
}

export { Form };
