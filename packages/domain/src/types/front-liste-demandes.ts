import { TasKStatus } from "@/modeles";
import { TaskInstanceType } from "./task-instance";
import { Timestamp } from "./timestamp";
import { WorkItemParams } from "./work-item-params";

type FrontListeDemandesType = {
    containerId: string;
    processes: {[key:string]:FrontProcessType};
};
type FrontProcessType= {
    processId: string;
    processName: string;
    processVersion: string;
    diagram: string;
    processInstances: {[key:string]:FrontProcessInstancesType};
};
type FrontProcessInstancesType = {
    initiator: string;
    processId: string;
    processName: string;
    version: string;
    processInstanceId: number;
    processInstanceState: number;
    startDate: Timestamp;
    slaDueDate: Timestamp;
    diagram: string;
    workitemInstances: {[key:string]:FrontWorkItemInstanceType};
    currentUserTasks: FrontTaskInstanceType[],
}
type FrontTaskInstanceType= {
    taskId: number;
    taskType: string;
    taskForm: string;
    taskName: string;
    taskSubject: string;
    taskDescription: string;
    taskStatus: TasKStatus;
    taskPriority: number;
    taskSkippable: string;
    taskWorkitemId: number;
    taskProcessInstanceId: number,
    taskActualOwner: string;
    taskCreatedBy: string;
    taskCreatedOn: Timestamp;
    taskActivationTime: Timestamp;
    taskExpirationTime: Timestamp;
    taskProcDefId: string;
    taskContainerId: string;
    taskParentId: number;
    taskProcessId: string;
    correlationKey: string|number;
    processType: string|number;
    slaCompliance: string;
    slaDueDate: Timestamp;
    taskPotOwners: string;
    taskExclOwners: string;
    taskBusinessAdmins: string[];
    taskInputData: string[];
    taskOutputData: string[];
}

type FrontWorkItemInstanceType = {
    workItemId: number;
    workItemName: string;
    workItemState: number;
    workItemParams: WorkItemParams;
    nodeId: number;
    nodeInstanceId: number;
    processInstanceId: number;
};

type OneFrontProcessInfoType =
{
    processId: string;
    processName: string;
    processInstanceVersion: string;
    processVersion: string;
    diagram: string;
    processInstanceInitiator: string;
	processInstanceId: number;
	processInstanceState: number;
	processInstancestartDate:  Timestamp;
	processInstanceSlaDueDate: Timestamp;
	processInstanceDiagram: string;
	workItemId: number;
	workItemName: string;
	workItemState: number;
	workItemParams: WorkItemParams;
	nodeId: number;
	nodeInstanceId: number;
}

export type {FrontListeDemandesType, FrontProcessType, FrontProcessInstancesType, FrontTaskInstanceType, FrontWorkItemInstanceType, OneFrontProcessInfoType};