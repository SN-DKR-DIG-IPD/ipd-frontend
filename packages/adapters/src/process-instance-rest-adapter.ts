import { IProcessInstanceAdapter, ProcessInstanceType, UserTasks, WorkItemInstances, getBPMDefaultConfigAPI } from "@jbpm/domain";

class ProcessInstanceRestAdapter implements IProcessInstanceAdapter {
    private defaultHeaders: HeadersInit = {};

    constructor() {
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
        const defaults = { ...(this.defaultHeaders || {}), ...(defaultsFromConfig || {}) } as Record<string,string>;
        const merged = { ...defaults, ...(customHeaders as Record<string,string> || {}) };
        if (!merged['Accept']) merged['Accept'] = 'application/json';
        if (!merged['Content-Type']) merged['Content-Type'] = 'application/json';
        return merged;
    }

    async getOneProcessInstanceDetail(baseUrl: string, containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<ProcessInstanceType> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}`;
        const response = await fetch(url, { headers: mergedHeaders });
        const jsonResp = await response.json();
        return jsonResp;
    }

    async createOneProcessInstance(baseUrl: string, containerId: string, processId: string, bodyJSON: Object, headers?: HeadersInit): Promise<number> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/containers/${containerId}/processes/${processId}/instances`;
        const response = await fetch(url, {
            method: "POST",
            headers: mergedHeaders,
            body: JSON.stringify(bodyJSON),
        });
        const createdProcessInstanceId = parseInt(await response.text());
        return createdProcessInstanceId;
    }

    async getAllTasksOfOneProcessInstance(baseUrl: string, processInstanceId: number, headers?: HeadersInit): Promise<UserTasks> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/queries/tasks/instances/process/${processInstanceId}`;
        const response = await fetch(url, { headers: mergedHeaders });
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getAllWorkitemsOfOneProcessInstance(baseUrl: string, containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<WorkItemInstances> {
        const mergedHeaders = this.mergeHeaders(headers);
        const url = `${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/workitems`;
        const response = await fetch(url, { headers: mergedHeaders });
        const jsonResp = await response.json();
        return jsonResp;
    }
}

export { ProcessInstanceRestAdapter }