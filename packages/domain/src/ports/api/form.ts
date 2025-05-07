
interface IFormAPI {
	getTaskInstanceForm(containerId : string, taskInstanceId: number, headers?: HeadersInit): Promise<string>;
	getCaseDefinitionForm(containerId : string, caseDefId: number, headers?: HeadersInit): Promise<string>;
	getProcessDefinitionForm(containerId : string, processId: string, headers?: HeadersInit): Promise<string>;
}

export type { IFormAPI };