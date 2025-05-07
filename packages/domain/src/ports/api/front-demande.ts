import { FrontProcessInstances } from "@/modeles/front-liste-demandes-modele";
import { FrontListeDemandesType } from "@/types";

interface IFrontDemandeAPI {
	setXmlSvgHeader(xmlSvgHeader: HeadersInit):void;
	getXmlSvgHeader();
	getDemandes(containerId?: string, headers?: HeadersInit): Promise<FrontListeDemandesType>;
	getProcesses(containerId: string, headers?: HeadersInit);
	getProcessInstances(containerId: string, headers?: HeadersInit): Promise<{[key:string]:FrontProcessInstances}>;
	getProcessByWorkItemId(workItemId: number, containerId: string, headers?: HeadersInit): Promise<any>;
	getProcessByProcessInstanceId(processInstanceId: number, containerId: string, headers?: HeadersInit): Promise<any>;
	getProcessByProcessId(processId: string, containerId: string, headers?: HeadersInit): Promise<any>;
}

export type {IFrontDemandeAPI};