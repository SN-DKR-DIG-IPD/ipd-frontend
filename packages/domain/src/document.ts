import { IDefaultConfigAPI, IDocumentAPI } from "./ports/api";
import { IDocumentAdapter } from "./ports/spi";
import { DocumentInstancesType, DocumentInstanceType } from "./types";

class Document implements IDocumentAPI {
	defaultConfig: IDefaultConfigAPI
	documentAdapter: IDocumentAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		documentAdapter: IDocumentAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.documentAdapter = documentAdapter;
	}

	displayDocumentContentById(documentId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<any> {
		return this.documentAdapter.getDocumentContentById(this.defaultConfig.getAPIBaseUrl(), documentId, headers)
	}

	displayDocumentById(documentId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<DocumentInstanceType> {
		return this.documentAdapter.getDocumentById(this.defaultConfig.getAPIBaseUrl(), documentId, headers)
	}

	listAllDocuments(page: number, pageSize: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<DocumentInstancesType> {
		return this.documentAdapter.getAllDocuments(this.defaultConfig.getAPIBaseUrl(), page, pageSize, headers)
	}

}

export { Document };
