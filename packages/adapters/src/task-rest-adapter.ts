import { TaskInstanceEvents, TaskInstances, ITaskAdapter, TaskInstanceType, getBPMDefaultConfigAPI } from "@jbpm/domain";

class TaskRestAdapter implements ITaskAdapter {
    private defaultHeaders: HeadersInit = {};

    constructor(){
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
        return merged;
    }

    async getOneTaskInstanceDetail(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceType> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/${taskInstanceId}`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getAllTasksAsAdmin(baseUrl: string, headers: HeadersInit): Promise<TaskInstances> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/admins`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getConnectedUserTasks(baseUrl: string, headers: HeadersInit, status='status=Created&status=Ready&status=Reserved&status=InProgress&status=Suspended&status=Completed&status=Reserved&status=Created&status=Failed&status=Error&status=Exited&status=Obsolete' ): Promise<TaskInstances> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/owners?${status}`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getConnectedUserPotentialTasks(baseUrl: string, headers: HeadersInit, status='status=Created&status=Ready&status=Reserved&status=InProgress&status=Suspended&status=Completed&status=Reserved&status=Created&status=Failed&status=Error&status=Exited&status=Obsolete' ): Promise<TaskInstances> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/pot-owners?${status}`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getOneTaskInstanceInfo(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceType> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/${taskInstanceId}`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getOneTaskInstanceEvents(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceEvents> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/${taskInstanceId}/events`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async getTaskInstancesHavingThisVariable(baseUrl: string, variableName: string, headers: HeadersInit): Promise<TaskInstances> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/variables/${variableName}`, {headers: merged});
        const jsonResp = await response.json();
        return jsonResp;
    }

    async putTaskInstanceState(baseUrl: string, containerId : string, taskInstanceId: number, headers: HeadersInit, state='claimed' ): Promise<string|null> {
        const merged = this.mergeHeaders(headers);
        const response = await fetch(`${baseUrl}server/containers/${containerId}/tasks/${taskInstanceId}/states/${state}`,
            {
            method: "PUT",
            headers: merged
            });
        const jsonResp = await response.text();
        return jsonResp;
    }
}

export { TaskRestAdapter }
