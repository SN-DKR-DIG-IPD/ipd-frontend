import { ProcessInstanceType, UserTasks, WorkItemInstances } from "@/types";
import { IProcessInstanceAdapter } from "../iprocess-instance-adapter";

class ProcessInstanceRestAdapter implements IProcessInstanceAdapter {
    constructor(){
    }
    async getOneProcessInstanceDetail(baseUrl: string, containerId: string, processInstanceId: number, headers: HeadersInit): Promise<ProcessInstanceType> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
    async createOneProcessInstance(baseUrl: string, containerId: string, processId: string, bodyJSON: Object, headers: HeadersInit): Promise<number> {
        	const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/${processId}/instances`, {
			method: "POST",
			headers
			,
			body: JSON.stringify(
                bodyJSON
            ),
		});
        const createdProcessInstanceId = parseInt(await response.text());
		return createdProcessInstanceId;
    }



    async getAllTasksOfOneProcessInstance(baseUrl: string, processInstanceId: number, headers: HeadersInit): Promise<UserTasks> {
        const response = await fetch(`${baseUrl}server/queries/tasks/instances/process/${processInstanceId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
    async getAllWorkitemsOfOneProcessInstance(baseUrl: string, containerId: string, processInstanceId: number, headers: HeadersInit): Promise<WorkItemInstances> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/workitems`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
}


export {ProcessInstanceRestAdapter}
