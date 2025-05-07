import { DocumentInstancesType, DocumentInstanceType } from "@/types";

interface IDocumentAdapter {
    getDocumentContentById(baseUrl: string,documentId: string, headers: HeadersInit): Promise<any>;
    getDocumentById(baseUrl: string,documentId: string, headers: HeadersInit): Promise<DocumentInstanceType>;
    getAllDocuments(baseUrl: string, page:number, pageSize: number, headers: HeadersInit): Promise<DocumentInstancesType>;
}
export type {IDocumentAdapter};