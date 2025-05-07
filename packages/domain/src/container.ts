import { IContainerAPI, IDefaultConfigAPI } from "./ports/api";
import { ContainerType } from "./types/container";
import { Containers } from "./types/containers";
import { ProcessType } from "./types/process";
import { ProcessInstances } from "./types/process-instances";
import { IContainerAdapter } from "./ports/spi";

class Container implements IContainerAPI {
	defaultConfig: IDefaultConfigAPI
	containerAdapter: IContainerAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		containerAdapter: IContainerAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.containerAdapter = containerAdapter;
	}

	listContainers(headers = this.defaultConfig.getDefaultHeaders()): Promise<Containers> {
		return this.containerAdapter.getContainers(this.defaultConfig.getAPIBaseUrl(), headers)
	}

	displayOneContainerDetail(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<ContainerType> {
		return this.containerAdapter.getOneContainerDetail(this.defaultConfig.getAPIBaseUrl(), containerId, headers)
	}

	displayAllProcesses(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<{ [key: string]: ProcessType[] }> {
		return this.containerAdapter.getAllProcesses(this.defaultConfig.getAPIBaseUrl(), containerId, headers)
	}

	displayAllProcessInstances(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<ProcessInstances> {
		return this.containerAdapter.getAllProcessInstances(this.defaultConfig.getAPIBaseUrl(), containerId, headers)
	}
}

export { Container };
