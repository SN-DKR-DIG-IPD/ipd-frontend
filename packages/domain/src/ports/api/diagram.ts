
interface IDiagramAPI {
	getProcessDiagram(containerId : string, processId: string, headers?: HeadersInit): Promise<string>;
	getProcessInstanceDiagram(containerId : string, processInstanceId: number, headers?: HeadersInit): Promise<string>;
}

export type { IDiagramAPI };