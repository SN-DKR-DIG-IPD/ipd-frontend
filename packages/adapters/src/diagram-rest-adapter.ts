import { IDiagramAdapter } from "@jbpm/domain";

class DiagramRestAdapter implements IDiagramAdapter {
    constructor(){
    }

    async getProcessDiagram(baseUrl: string, containerId: string, processId: string, headers: HeadersInit): Promise<string> {
        const url = `${baseUrl}server/containers/${containerId}/images/processes/${processId}`; // Removed /
        console.log('🔍 DiagramRestAdapter - getProcessDiagram - URL:', url);
        const response = await fetch(url, {headers});
		const textResp = await response.text();
        return textResp;
    }

    async getProcessInstanceDiagram(baseUrl: string, containerId: string, processInstanceId: number, headers: HeadersInit): Promise<string> {
        console.log('🔍 DiagramRestAdapter - Paramètres reçus:', { baseUrl, containerId, processInstanceId });
        
        // Construire l'URL correcte
        const url = `${baseUrl}server/containers/${containerId}/images/processes/instances/${processInstanceId}`; // Removed /
        console.log('🔍 DiagramRestAdapter - URL construite:', url);
        console.log('🔍 DiagramRestAdapter - Headers:', headers);
        
        const response = await fetch(url, {headers});
        console.log('🔍 DiagramRestAdapter - Status:', response.status, response.statusText);
        
        if (!response.ok) {
            console.error('❌ DiagramRestAdapter - Erreur HTTP:', response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
		const textResp = await response.text();
        console.log('✅ DiagramRestAdapter - Réponse reçue, longueur:', textResp.length);
        return textResp;
    }
}

export { DiagramRestAdapter }