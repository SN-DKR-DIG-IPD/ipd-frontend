import { ContainerType } from "../../types/container";
import { Containers } from "../../types/containers";
import { ProcessType } from "../../types/process";
import { ProcessInstances } from "../../types/process-instances";

interface IContainerAdapter {
    getContainers(baseUrl: string, headers: HeadersInit) : Promise<Containers>
    getOneContainerDetail(baseUrl: string, containerId : string, headers: HeadersInit) : Promise<ContainerType>
    getAllProcesses(baseUrl: string, containerId : string, headers: HeadersInit): Promise<{ [key: string]: ProcessType[] }>
    getAllProcessInstances(baseUrl: string, containerId : string, headers: HeadersInit): Promise<ProcessInstances>
}
export type {IContainerAdapter };