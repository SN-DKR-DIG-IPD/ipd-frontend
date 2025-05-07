interface IDefaultConfigAdapter {
	setAPIBaseUrl(url: string): void;
	getAPIBaseUrl(): string;
	setBusinessCentralAPIBaseUrl(url: string): void;
	getBusinessCentralAPIBaseUrl(): string;
	setDefaultHeaders(headers: HeadersInit): void;
	getDefaultHeaders(): HeadersInit;
}

export type { IDefaultConfigAdapter };