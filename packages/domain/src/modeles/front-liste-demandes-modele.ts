import { Timestamp } from "../types/timestamp";
import { WorkItemParams as WorkItemParamsType } from "../types/work-item-params";

class FrontListeDemandes {
    constructor(
    public containerId: string = '',
    public processes: {[key:string]:FrontProcess} = {}
    ){}
}

class FrontProcess {
    constructor(
    public processId: string = '',
    public processName: string = '',
    public processVersion: string = '',
    public diagram: string = '',
    public processInstances: {[key:string]:FrontProcessInstances} = {},
    ){}
}
class OneFrontProcessInfo
{
    constructor(
    public containerId: string= '',
    public processId: string= '',
    public processName: string= '',
    public processVersion: string= '',
    public processInstanceVersion: string= '',
    public diagram: string= '',
    public processInstanceInitiator: string= '',
	public processInstanceId: number=-2,
	public processInstanceState: number=-2,
	public processInstancestartDate:  Timestamp = {"java.util.Date": new Date().getTime()},
	public processInstanceSlaDueDate: Timestamp = {"java.util.Date": new Date().getTime()},
	public processInstanceDiagram: string= '',
	public workItemId: number=-2,
	public workItemName: string= '',
	public workItemState: number=-2,
	public workItemParams: WorkItemParamsType = new WorkItemParams(),
	public nodeId: number=-2,
	public nodeInstanceId: number=-2){}
}

class FrontProcessInstances {
    constructor(
        public initiator: string = '',
        public processName: string = '',
        public processId: string = '',
        public version: string = '',
        public processInstanceId: number=-2,
        public processInstanceState: number=-2,
        public startDate: Timestamp = {"java.util.Date": new Date().getTime()},
        public slaDueDate: Timestamp= {"java.util.Date": new Date().getTime()},
        public diagram: string= '',
        public workitemInstances: {[key:string]:FrontWorkItemInstance} = {},
        public currentUserTasks: FrontTaskInstance[]=[],
    ){}
}

class FrontTaskInstance{
    constructor(
    public taskId: number= -2,
    public taskType: string='',
    public taskForm: string='',
    public taskName: string='',
    public taskSubject: string='',
    public taskDescription: string='',
    public taskStatus : TasKStatus = TasKStatus.Unknow,
    public taskPriority: number= -2,
    public taskSkippable: string='',
    public taskWorkitemId: number= -2,
    public taskProcessInstanceId : number,
    public taskActualOwner: string='',
    public taskCreatedBy: string='',
    public taskCreatedOn: Timestamp = {"java.util.Date": new Date().getTime()},
    public taskActivationTime: Timestamp = {"java.util.Date": new Date().getTime()},
    public taskExpirationTime: Timestamp = {"java.util.Date": new Date().getTime()},
    public taskProcDefId: string='',
    public taskContainerId: string='',
    public taskParentId: number= -2,
    public taskProcessId : string='',
    public correlationKey: string|number= -2,
    public processType: string|number= -2,
    public slaCompliance : string='',
    public slaDueDate : Timestamp = {"java.util.Date": new Date().getTime()},
    public taskPotOwners : string='',
    public taskExclOwners : string='',
    public taskBusinessAdmins : string[]=[],
    public taskInputData : string[]=[],
    public taskOutputData : string[]=[],){}
}
enum TasKStatus{
Unknow ="Unknow",
Created="Created",
Ready ="Ready",
Reserved = "Reserved",
InProgess = "InProgress",
Suspended = "Suspended",
Completed= "Completed",
Failed= "Failed",
Error= "Error",
Exited= "Exited",
Obsolete= "Obsolete"
}
class FrontWorkItemInstance {
    constructor(
    public workItemId: number=-2,
    public workItemName: string = '',
    public workItemState: number = -2,
    public workItemParams: WorkItemParamsType = new WorkItemParams(),
    public nodeId: number = -2,
    public nodeInstanceId: number= -2,
    public processInstanceId: number = -2
    ){}
}

class WorkItemParams {
    constructor(
        public Comment: string ='',
        public reason: string= '',
        public performance: number=-2,
        public TaskName: string= '',
        public NodeName: string= '',
        public Skippable: string= '',
        public BusinessAdministratorId: string= '',
        public GroupId: string=''){}
}

export { FrontListeDemandes, FrontProcess, FrontProcessInstances, FrontWorkItemInstance, OneFrontProcessInfo, WorkItemParams, FrontTaskInstance, TasKStatus };