import { IDiagramAdapter } from "@jbpm/domain";

class DiagramRestAdapter implements IDiagramAdapter {
    constructor(){
    }

    async getProcessDiagram(baseUrl: string, containerId: string, processId: string, headers: HeadersInit): Promise<string> {
        const url = `${baseUrl}containers/${containerId}/images/processes/${processId}`;
        console.log('🔍 DiagramRestAdapter - getProcessDiagram - URL:', url);
        const response = await fetch(url, {headers});
		const textResp = await response.text();
        return textResp;
    }

    async getProcessInstanceDiagram(baseUrl: string, containerId: string, processInstanceId: number, headers: HeadersInit): Promise<string> {
        console.log('🔍 DiagramRestAdapter - Paramètres reçus:', { baseUrl, containerId, processInstanceId });
        
        // Essayer d'abord l'endpoint d'instance (qui peut ne pas exister)
        const instanceUrl = `${baseUrl}containers/${containerId}/images/processes/instances/${processInstanceId}`;
        console.log('🔍 DiagramRestAdapter - Tentative avec URL instance:', instanceUrl);
        
        try {
            const response = await fetch(instanceUrl, {headers});
            console.log('🔍 DiagramRestAdapter - Status instance:', response.status, response.statusText);
            
            if (response.ok) {
                const textResp = await response.text();
                console.log('✅ DiagramRestAdapter - Diagramme d\'instance récupéré, longueur:', textResp.length);
                return textResp;
            } else {
                console.log('⚠️ DiagramRestAdapter - Endpoint instance non disponible, fallback vers définition...');
            }
        } catch (error) {
            console.log('⚠️ DiagramRestAdapter - Erreur endpoint instance, fallback vers définition...');
        }
        
        // Fallback vers la définition de processus (plus fiable)
        const definitionUrl = `${baseUrl}containers/${containerId}/images/processes/evaluation`;
        console.log('🔍 DiagramRestAdapter - Fallback vers URL définition:', definitionUrl);
        
        try {
            const response = await fetch(definitionUrl, {headers});
            console.log('🔍 DiagramRestAdapter - Status définition:', response.status, response.statusText);
            
            if (response.ok) {
                const textResp = await response.text();
                console.log('✅ DiagramRestAdapter - Diagramme de définition récupéré, longueur:', textResp.length);
                return textResp;
            } else {
                console.error('❌ DiagramRestAdapter - Erreur HTTP définition:', response.status, response.statusText);
                return '<div class="text-center p-4 text-gray-500">Diagramme non disponible (Erreur ' + response.status + ')</div>';
            }
        } catch (error) {
            console.error('❌ DiagramRestAdapter - Erreur définition:', error);
            return '<div class="text-center p-4 text-gray-500">Diagramme non disponible (Erreur réseau)</div>';
        }
    }
}

export { DiagramRestAdapter }