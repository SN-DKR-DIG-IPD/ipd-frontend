import { WorkItemInstance } from "@/types";
import { IWorkItemsAdapter } from "../iwork-items-adapter";

class WorkItemsRestAdapter implements IWorkItemsAdapter {
    constructor(){
    }
    async getWorkitemInfo(baseUrl: string, containerId: string, processInstanceId: number, workItemId: number, headers: HeadersInit): Promise<WorkItemInstance> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/workitems/${workItemId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async completeWorkItemOfProcessInstance(baseUrl: string, containerId: string, processInstanceId: number, workItemId: number, bodyJSON: Object, headers: HeadersInit): Promise<number> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances/${processInstanceId}/workitems/${workItemId}/completed`, {
			method: "POST",
			headers,
			body: JSON.stringify(
                bodyJSON
            ),
		});
        const createdProcessInstanceId = parseInt(await response.text());
		return createdProcessInstanceId;
    }
}

export { WorkItemsRestAdapter }