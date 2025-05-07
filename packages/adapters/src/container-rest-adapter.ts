import { IContainerAdapter, ContainerType, Containers, ProcessType, ProcessInstances } from "@jbpm/domain";

class ContainerRestAdapter implements IContainerAdapter {
    constructor(){
    }

    async getContainers(baseUrl: string, headers: HeadersInit) : Promise<Containers> {
        const response = await fetch(`${baseUrl}server/containers`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getOneContainerDetail(baseUrl: string, containerId : string, headers: HeadersInit) : Promise<ContainerType>{
        const response = await fetch(`${baseUrl}server/containers/${containerId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
    async getAllProcesses(baseUrl: string, containerId : string, headers: HeadersInit): Promise<{ [key: string]: ProcessType[]; }>{
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
    async getAllProcessInstances(baseUrl: string, containerId : string, headers: HeadersInit): Promise<ProcessInstances>{
        const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/instances`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
}


export {ContainerRestAdapter}