import { IFormAdapter } from "@jbpm/domain"
import { getBPMDefaultConfigAPI } from "@jbpm/domain";

class FormRestAdapter implements IFormAdapter {
    private defaultHeaders: HeadersInit = {};

    constructor() {
        // Les headers par défaut pourront être fournis, mais on tentera aussi de lire la config globale
    }

    setDefaultHeaders(headers: HeadersInit): void {
        this.defaultHeaders = headers;
    }

    private getGlobalDefaultHeaders(): HeadersInit {
        try {
            const api = getBPMDefaultConfigAPI?.();
            return (api?.getDefaultHeaders?.() as HeadersInit) || {};
        } catch {
            return {};
        }
    }

    private mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
        const defaultsFromConfig = this.getGlobalDefaultHeaders() || {};
        const defaults = { ...(this.defaultHeaders || {}), ...(defaultsFromConfig || {}) };
        const merged: Record<string, string> = { ...defaults as Record<string, string>, ...(customHeaders as Record<string, string> || {}) };
        // GET HTML: pas de Content-Type
        if ('Content-Type' in merged) delete merged['Content-Type'];
        if (!merged['Accept']) merged['Accept'] = 'text/html';
        return merged;
    }

    async getTaskInstanceForm(baseUrl: string, containerId: string, taskInstanceId: number, headers?: HeadersInit): Promise<string> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/containers/${containerId}/forms/tasks/${taskInstanceId}/content`;
        // Debug minimal
        // console.debug('▶ getTaskForm', { url, hasAuth: !!(mergedHeaders as any)['Authorization'], accept: (mergedHeaders as any)['Accept'] });
        const response = await fetch(url, { headers: mergedHeaders });
        if (response.status === 404) {
            throw new Error('FORM_NOT_FOUND');
        }
        if (!response.ok) {
            throw new Error(`FORM_HTTP_${response.status}`);
        }
        const textResp = await response.text();
        return textResp;
    }

    async getCaseDefinitionForm(baseUrl: string, containerId: string, caseDefId: number, headers?: HeadersInit): Promise<string> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/containers/${containerId}/forms/cases/${caseDefId}/content`;
        const response = await fetch(url, { headers: mergedHeaders });
        if (!response.ok) {
            throw new Error(`FORM_HTTP_${response.status}`);
        }
        const textResp = await response.text();
        return textResp;
    }

    async getProcessDefinitionForm(baseUrl: string, containerId: string, processId: string, headers?: HeadersInit): Promise<string> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/containers/${containerId}/forms/processes/${processId}/content`;
        const response = await fetch(url, { headers: mergedHeaders });
        if (!response.ok) {
            throw new Error(`FORM_HTTP_${response.status}`);
        }
        const textResp = await response.text();
        return textResp;
    }
}

export { FormRestAdapter }