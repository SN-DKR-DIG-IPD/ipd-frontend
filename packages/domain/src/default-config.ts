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

// ✅ Singleton pour BPMDefaultConfigAPI
let bpmDefaultConfigInstance: DefaultConfig | null = null;

export function createBPMDefaultConfigAPI(defaultConfigAdapter: IDefaultConfigAdapter): DefaultConfig {
	if (!bpmDefaultConfigInstance) {
		bpmDefaultConfigInstance = new DefaultConfig(defaultConfigAdapter);
	}
	return bpmDefaultConfigInstance;
}

export function getBPMDefaultConfigAPI(): DefaultConfig | null {
	return bpmDefaultConfigInstance;
}

export { DefaultConfig };
