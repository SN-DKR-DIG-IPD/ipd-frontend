import { IProcessInstanceAdapter, ProcessInstanceType, UserTasks, WorkItemInstances } from "@jbpm/domain";

class ProcessInstanceRestAdapter implements IProcessInstanceAdapter {
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

    async getOneProcessInstanceDetail(baseUrl: string, containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<ProcessInstanceType> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}`, {
            headers: mergedHeaders
        });
        const jsonResp = await response.json();
        return jsonResp;
    }

    async createOneProcessInstance(baseUrl: string, containerId: string, processId: string, bodyJSON: Object, headers?: HeadersInit): Promise<number> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/${processId}/instances`, {
            method: "POST",
            headers: mergedHeaders,
            body: JSON.stringify(bodyJSON),
        });
        const createdProcessInstanceId = parseInt(await response.text());
        return createdProcessInstanceId;
    }

    async getAllTasksOfOneProcessInstance(baseUrl: string, processInstanceId: number, headers?: HeadersInit): Promise<UserTasks> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/process/${processInstanceId}`, {
            headers: mergedHeaders
        });
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getAllWorkitemsOfOneProcessInstance(baseUrl: string, containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<WorkItemInstances> {
        const mergedHeaders = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/workitems`, {
            headers: mergedHeaders
        });
        const jsonResp = await response.json();
        return jsonResp;
    }
}

export { ProcessInstanceRestAdapter }