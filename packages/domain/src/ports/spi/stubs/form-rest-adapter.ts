import { IFormAdapter } from "../iform-adapter";

class FormRestAdapter implements IFormAdapter {
    constructor(){
    }

    async getTaskInstanceForm(baseUrl: string, containerId: string, taskInstanceId: number, headers: HeadersInit): Promise<string> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/tasks/${taskInstanceId}/content`, {headers});
		const textResp = await response.text();
        return textResp;
    }

    async getCaseDefinitionForm(baseUrl: string, containerId: string, caseDefId: number, headers: HeadersInit): Promise<string> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/cases/${caseDefId}/content`, {headers});
		const textResp = await response.text();
        return textResp;
    }

    async getProcessDefinitionForm(baseUrl: string, containerId: string, processId: string, headers: HeadersInit): Promise<string> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/processes/${processId}/content`, {headers});
		const textResp = await response.text();
        return textResp;
    }
}

export { FormRestAdapter }