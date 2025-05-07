
interface IDiagramAdapter {
	getProcessDiagram(baseUrl: string, containerId : string, processId: string, headers: HeadersInit): Promise<string>;
	getProcessInstanceDiagram(baseUrl: string, containerId : string, processInstanceId: number, headers: HeadersInit): Promise<string>;
}

export type { IDiagramAdapter };