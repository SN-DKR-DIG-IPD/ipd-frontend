import { IFormAdapter } from "@jbpm/domain"

class FormRestAdapter implements IFormAdapter {
    private defaultHeaders: HeadersInit = {};

    constructor() {
        // Les headers par défaut seront injectés via setDefaultHeaders
    }

    setDefaultHeaders(headers: HeadersInit): void {
        this.defaultHeaders = headers;
    }

    private mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
        const defaults = this.defaultHeaders || {};
        const merged = { ...defaults, ...(customHeaders || {}) };
        return merged;
    }

    async getTaskInstanceForm(baseUrl: string, containerId: string, taskInstanceId: number, headers?: HeadersInit): Promise<string> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/tasks/${taskInstanceId}/content`, {
            headers: mergedHeaders
        });
        const textResp = await response.text();
        return textResp;
    }

    async getCaseDefinitionForm(baseUrl: string, containerId: string, caseDefId: number, headers?: HeadersInit): Promise<string> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/cases/${caseDefId}/content`, {
            headers: mergedHeaders
        });
        const textResp = await response.text();
        return textResp;
    }

    async getProcessDefinitionForm(baseUrl: string, containerId: string, processId: string, headers?: HeadersInit): Promise<string> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/processes/${processId}/content`, {
            headers: mergedHeaders
        });
        const textResp = await response.text();
        return textResp;
    }
}

export { FormRestAdapter }