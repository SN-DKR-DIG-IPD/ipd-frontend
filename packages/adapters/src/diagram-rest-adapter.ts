import { IDiagramAdapter } from "@jbpm/domain";

class DiagramRestAdapter implements IDiagramAdapter {
    constructor(){
    }

    async getProcessDiagram(baseUrl: string, containerId: string, processId: string, headers: HeadersInit): Promise<string> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/images/processes/${processId}`, {headers});
		const textResp = await response.text();
        return textResp;
    }

    async getProcessInstanceDiagram(baseUrl: string, containerId: string, processInstanceId: number, headers: HeadersInit): Promise<string> {
        const response = await fetch(`${baseUrl}server/containers/${containerId}/images/processes/instances/${processInstanceId}`, {headers});
		const textResp = await response.text();
        return textResp;
    }
}

export { DiagramRestAdapter }