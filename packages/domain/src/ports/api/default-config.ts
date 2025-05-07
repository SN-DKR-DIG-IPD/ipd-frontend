interface IDefaultConfigAPI {
	setAPIBaseUrl(url: string): void;
	setBusinessCentralAPIBaseUrl(url: string): void;
	getAPIBaseUrl(): string;
	getBusinessCentralAPIBaseUrl(): string;
	setDefaultHeaders(headers: HeadersInit): void;
	getDefaultHeaders(): HeadersInit;
}

export type { IDefaultConfigAPI };