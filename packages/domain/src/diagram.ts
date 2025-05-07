import { IDefaultConfigAPI, IDiagramAPI } from "./ports/api";
import { IDiagramAdapter } from "./ports/spi";

class Diagram implements IDiagramAPI {
	defaultConfig: IDefaultConfigAPI
	diagramAdapter: IDiagramAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		diagramAdapter: IDiagramAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.diagramAdapter = diagramAdapter;
	}
	getProcessDiagram(containerId: string, processId: string, headers?: HeadersInit): Promise<string> {
		return this.diagramAdapter.getProcessDiagram(this.defaultConfig.getAPIBaseUrl(), containerId, processId,  headers!)
	}
	getProcessInstanceDiagram(containerId: string, processInstanceId: number, headers?: HeadersInit): Promise<string> {
		return this.diagramAdapter.getProcessInstanceDiagram(this.defaultConfig.getAPIBaseUrl(), containerId, processInstanceId, headers!)
	}
}

export { Diagram };
