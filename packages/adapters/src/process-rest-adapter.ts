import { IProcessAdapter, ProcessInstances, ProcessDetail, ProcessVariables } from "@jbpm/domain";

class ProcessRestAdapter implements IProcessAdapter {
    constructor(){
    }
    
    async getOneProcessDetail(baseUrl: string, containerId: string, processId: string, headers: HeadersInit): Promise<ProcessDetail> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/definitions/${processId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getOneProcessVariables(baseUrl: string, containerId: string, processId: string, headers: HeadersInit): Promise<ProcessVariables> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/definitions/${processId}/variables`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    getAllInstancesOfOneProcess(baseUrl: string, containerId: string, headers: HeadersInit): Promise<ProcessInstances> {
        throw new Error("Method not implemented.");
    }
}


export {ProcessRestAdapter}