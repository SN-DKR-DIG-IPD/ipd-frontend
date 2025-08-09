import { TaskInstanceEvents, TaskInstances, ITaskAdapter, TaskInstanceType } from "@jbpm/domain";

class TaskRestAdapter implements ITaskAdapter {
    constructor(){
    }

    async getOneTaskInstanceDetail(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceType> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/${taskInstanceId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getAllTasksAsAdmin(baseUrl: string, headers: HeadersInit): Promise<TaskInstances> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/admins`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getConnectedUserTasks(baseUrl: string, headers: HeadersInit, status='status=Created&status=Ready&status=Reserved&status=InProgress&status=Suspended&status=Completed&status=Reserved&status=Created&status=Failed&status=Error&status=Exited&status=Obsolete' ): Promise<TaskInstances> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/owners?${status}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getConnectedUserPotentialTasks(baseUrl: string, headers: HeadersInit, status='status=Created&status=Ready&status=Reserved&status=InProgress&status=Suspended&status=Completed&status=Reserved&status=Created&status=Failed&status=Error&status=Exited&status=Obsolete' ): Promise<TaskInstances> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/pot-owners?${status}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getOneTaskInstanceInfo(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceType> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/${taskInstanceId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getOneTaskInstanceEvents(baseUrl: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskInstanceEvents> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/${taskInstanceId}/events`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getTaskInstancesHavingThisVariable(baseUrl: string, variableName: string, headers: HeadersInit): Promise<TaskInstances> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/variables/${variableName}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async putTaskInstanceState(baseUrl: string, containerId : string, taskInstanceId: number, headers: HeadersInit, state='claimed' ): Promise<string|null> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/tasks/${taskInstanceId}/states/${state}`,
            {
			method: "PUT",
			headers
            });
		const jsonResp = await response.text();
        return jsonResp;
    }
}

export { TaskRestAdapter }
