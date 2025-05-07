import { ContainerType } from "../../types/container";
import { Containers } from "../../types/containers";
import { ProcessType } from "../../types/process";
import { ProcessInstances } from "../../types/process-instances";

interface IContainerAPI {
    listContainers(headers?: HeadersInit) : Promise<Containers>
    displayOneContainerDetail(containerId : string, headers?: HeadersInit) : Promise<ContainerType>
    displayAllProcesses(containerId : string, headers?: HeadersInit): Promise<{[key:string]:ProcessType[]}>
    displayAllProcessInstances(containerId : string, headers?: HeadersInit): Promise<ProcessInstances>
}

export type {IContainerAPI};