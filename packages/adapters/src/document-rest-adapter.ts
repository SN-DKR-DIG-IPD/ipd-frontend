import { IDocumentAdapter, DocumentInstanceType, DocumentInstancesType } from "@jbpm/domain";

class DocumentRestAdapter implements IDocumentAdapter {
    constructor(){
    }

    async getDocumentContentById(baseUrl: string, documentId: string, headers: HeadersInit): Promise<any> {
        const response = await fetch(`${baseUrl}server/documents/${documentId}/content`, {headers});
		const textResp = await response.text();
        return textResp;

    }

    async getDocumentById(baseUrl: string, documentId: string, headers: HeadersInit): Promise<DocumentInstanceType> {
        const response = await fetch(`${baseUrl}server/documents/${documentId}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async getAllDocuments(baseUrl: string, page: number, pageSize: number, headers: HeadersInit): Promise<DocumentInstancesType> {
        const response = await fetch(`${baseUrl}server/documents?page=${page}&pageSize=${pageSize}`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
}

export { DocumentRestAdapter }