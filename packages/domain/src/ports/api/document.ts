import { DocumentInstancesType, DocumentInstanceType } from "@/types";

interface IDocumentAPI {
    displayDocumentContentById(documentId: string, headers?: HeadersInit): Promise<any>;
    displayDocumentById(documentId: string, headers?: HeadersInit): Promise<DocumentInstanceType>;
    listAllDocuments( page:number, pageSize: number, headers?: HeadersInit): Promise<DocumentInstancesType>;
}

export type {IDocumentAPI };