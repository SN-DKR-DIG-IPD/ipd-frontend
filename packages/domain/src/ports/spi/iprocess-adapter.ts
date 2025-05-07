import { ProcessDetail } from "../../types/process-detail";
import { ProcessInstances } from "../../types/process-instances";
import { ProcessVariables } from "../../types/process-variables";

interface IProcessAdapter {
    getOneProcessDetail(baseUrl: string, containerId : string, processId : string, headers: HeadersInit): Promise<ProcessDetail>
    getOneProcessVariables(baseUrl: string, containerId : string, processId : string, headers: HeadersInit): Promise<ProcessVariables>
    getAllInstancesOfOneProcess(baseUrl: string, containerId : string, headers: HeadersInit): Promise<ProcessInstances>
}
export type {IProcessAdapter};