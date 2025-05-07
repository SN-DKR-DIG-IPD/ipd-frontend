import { ProcessDetail } from "../../types/process-detail";
import { ProcessInstances } from "../../types/process-instances";
import { ProcessVariables } from "../../types/process-variables";

interface IProcessAPI {
    displayOneProcessDetail(containerId : string, processId : string, headers?: HeadersInit): Promise<ProcessDetail>
    displayOneProcessVariables(containerId : string, processId : string, headers?: HeadersInit): Promise<ProcessVariables>
    displayAllInstancesOfOneProcess(containerId : string, headers?: HeadersInit): Promise<ProcessInstances>
}
export type {IProcessAPI};