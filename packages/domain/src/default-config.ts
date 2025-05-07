import { IDefaultConfigAPI } from "./ports/api";
import { IDefaultConfigAdapter } from "./ports/spi";

class DefaultConfig implements IDefaultConfigAPI {
	defaultConfigAdapter: IDefaultConfigAdapter;

	constructor(
		defaultConfigAdapter: IDefaultConfigAdapter,
	) {
		this.defaultConfigAdapter = defaultConfigAdapter;
	}
	setAPIBaseUrl(url: string): void {
		this.defaultConfigAdapter.setAPIBaseUrl(url)
	}
	getAPIBaseUrl(): string {
		return this.defaultConfigAdapter.getAPIBaseUrl()
	}

	setBusinessCentralAPIBaseUrl(url: string): void {
		this.defaultConfigAdapter.setBusinessCentralAPIBaseUrl(url)
	}
	
	getBusinessCentralAPIBaseUrl(): string {
		return this.defaultConfigAdapter.getBusinessCentralAPIBaseUrl()
	}

	setDefaultHeaders(headers: HeadersInit): void {
		this.defaultConfigAdapter.setDefaultHeaders(headers)
	}

	getDefaultHeaders(): HeadersInit {
		return this.defaultConfigAdapter.getDefaultHeaders()
	}
	
	getDefaultConfig(): IDefaultConfigAdapter{
		return this.defaultConfigAdapter
	}
}

export { DefaultConfig };
