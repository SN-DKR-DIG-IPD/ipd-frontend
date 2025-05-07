
interface IFormAdapter {
	getTaskInstanceForm(baseUrl: string, containerId : string, taskInstanceId: number, headers: HeadersInit ): Promise<string>;
	getCaseDefinitionForm(baseUrl: string, containerId : string, caseDefId: number, headers: HeadersInit): Promise<string>;
	getProcessDefinitionForm(baseUrl: string, containerId : string, processId: string, headers: HeadersInit): Promise<string>;
}

export type { IFormAdapter };