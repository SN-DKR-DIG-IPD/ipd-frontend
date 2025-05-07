import { FrontListeDemandes, FrontProcess, FrontProcessInstances, FrontTaskInstance, FrontWorkItemInstance, OneFrontProcessInfo, WorkItemParams } from "./modeles/front-liste-demandes-modele";
import { IAccountAPI, IContainerAPI, IDefaultConfigAPI, IDiagramAPI, IProcessInstanceAPI, ITaskAPI } from "./ports/api";
import { IFrontDemandeAPI } from "./ports/api/front-demande";
import {FrontListeDemandesType, FrontTaskInstanceType} from "./types";

class FrontDemande implements IFrontDemandeAPI {

	defaultConfig: IDefaultConfigAPI
	container: IContainerAPI;
	processInstance: IProcessInstanceAPI;
	diagram: IDiagramAPI;
	account: IAccountAPI;
	task: ITaskAPI;
	xmlSvgHeader: HeadersInit ={};

	constructor(
		defaultConfig: IDefaultConfigAPI,
		account: IAccountAPI,
		container: IContainerAPI,
		processInstance: IProcessInstanceAPI,
		task: ITaskAPI,
		diagram: IDiagramAPI,
		xmlSvgHeader?: HeadersInit
	) {
		this.defaultConfig = defaultConfig
		this.container = container;
		this.task = task;
		this.processInstance = processInstance;
		this.diagram = diagram;
		this.account = account;
		if(xmlSvgHeader){
			this.setXmlSvgHeader(xmlSvgHeader);
		}
	}

	setXmlSvgHeader(xmlSvgHeader: HeadersInit){
		this.xmlSvgHeader = xmlSvgHeader;
	}
	
	getXmlSvgHeader(){
		return this.xmlSvgHeader
	}
	async getDemandes(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<FrontListeDemandes> {
		let demandes: FrontListeDemandesType= new FrontListeDemandes()
			demandes.containerId= containerId
			demandes.processes = await this.getProcesses(containerId, headers)
			return demandes
	}

	async getProcesses(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<{[key:string]:FrontProcess}> {
    	let processes: {[key:string]:FrontProcess} = {}

		let listProcesses = await this.container.displayAllProcesses(containerId, headers).then((listProcesses)=>{
			return listProcesses
		})

		listProcesses.processes!.forEach(e => {
			processes[e["process-id"]] = new FrontProcess()
			processes[e["process-id"]]!.processId = e["process-id"]
			processes[e["process-id"]]!.processName = e["process-name"]
			processes[e["process-id"]]!.processVersion = e["process-version"]
		})
		for(let processId of Object.keys(processes)){
			processes[processId]!.diagram = await this.getProcessDiagram(containerId, processId)
			processes[processId]!.processInstances = await this.getProcessInstances(containerId, headers)
		}
		return processes
	}

	async getProcessInstances(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<{[key:string]:FrontProcessInstances}> {
    	let processInstances: {[key:string]:FrontProcessInstances} = {}
			let listProcessInstances= await this.container.displayAllProcessInstances(containerId, headers).then((processInstances)=>{
				return processInstances
			})


		listProcessInstances['process-instance'].forEach(e => {
			processInstances[e["process-instance-id"]] = new FrontProcessInstances()
			processInstances[e["process-instance-id"]]!.initiator = e.initiator
			processInstances[e["process-instance-id"]]!.processId = e["process-id"]
			processInstances[e["process-instance-id"]]!.processName = e["process-name"]
			processInstances[e["process-instance-id"]]!.version = e["version"]
			processInstances[e["process-instance-id"]]!.processInstanceId = e["process-instance-id"]
			processInstances[e["process-instance-id"]]!.processInstanceState = e["process-instance-state"]
			processInstances[e["process-instance-id"]]!.startDate = e["start-date"]
			processInstances[e["process-instance-id"]]!.slaDueDate = e["sla-due-date"]
		})

		for(let processInstanceId of Object.keys(processInstances)){
			processInstances[processInstanceId]!.diagram = await this.getProcessInstanceDiagram(containerId, new Number(processInstanceId).valueOf())
			processInstances[processInstanceId]!.workitemInstances = await this.getworkitemInstances(containerId, new Number(processInstanceId).valueOf(), headers)
		}
		return processInstances
	}

	// async getCurrentUserTasks(containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<{[key:string]:FrontProcess}> {
    // 	let currentUserTasks: FrontTaskInstanceType[] = []

	// 	let listOfUserTasks = await this.task.displayConnectedUserTasks(headers).then((userTasks)=>{
	// 		return userTasks
	// 	})
	// 	listOfUserTasks["task-summary"].forEach(task=>{
	// 		currentUserTasks.push(new FrontTaskInstance(
	// 			taskId = task["task-id"],
	// 			taskType = task["task-type"],
	// 			taskForm = task["task-form"],
	// 			taskName = task["task-name"],
	// 			taskSubject= task["task-subject"],
	// 			taskDescription= task["task-description"],
	// 			TasKStatus = task["task-status"],
	// 			taskPriority= task["task-priority"],
	// 			taskSkippable= task["task-skippable"],
	// 			taskWorkitemId = task["task-workitem-id"],
	// 			taskProcessInstanceId= task["task-process-instance-id"],
	// 			taskActualOwner= task["task-actual-owner"],


	// 		))
	// 	})
	// 	return currentUserTasks
	// }
	async getworkitemInstances(containerId: string, processInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<{[key:string]:FrontWorkItemInstance}> {
        let workitemInstances: {[key:string]:FrontWorkItemInstance} = {}

		let listOfworkitemInstances = await this.processInstance.displayAllWorkitemsOfOneProcessInstance(containerId, processInstanceId, headers).then((workitemInstances)=>{
			return workitemInstances
		})

		listOfworkitemInstances['work-item-instance']!.forEach(e => {
			workitemInstances[e["work-item-id"]] = new FrontWorkItemInstance()
			workitemInstances[e["work-item-id"]]!.workItemId = e["work-item-id"]
			workitemInstances[e["work-item-id"]]!.nodeId = e["node-id"]
			workitemInstances[e["work-item-id"]]!.nodeInstanceId = e["node-instance-id"]
			workitemInstances[e["work-item-id"]]!.workItemName = e["work-item-name"]
			workitemInstances[e["work-item-id"]]!.workItemState = e["work-item-state"]
			workitemInstances[e["work-item-id"]]!.workItemParams = new WorkItemParams(e["work-item-params"].Comment, e["work-item-params"].reason, e["work-item-params"].performance, e["work-item-params"].TaskName, e["work-item-params"].NodeName, e["work-item-params"].Skippable, e["work-item-params"].BusinessAdministratorId, e["work-item-params"].GroupId)
			workitemInstances[e["work-item-id"]]!.processInstanceId = e["process-instance-id"]
		})
		return workitemInstances
	}

	async getProcessDiagram(containerId: string, processId: string){
		return await this.diagram.getProcessDiagram(containerId, processId, this.xmlSvgHeader).then(async (diagram)=>{
						return diagram
		})
	}

	async getProcessInstanceDiagram(containerId: string, processInstanceId: number){
		return await this.diagram.getProcessInstanceDiagram(containerId, processInstanceId, this.xmlSvgHeader).then(async (diagram)=>{
						return diagram
		})
	}

	async getProcessByWorkItemId(workItemId: number, containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<OneFrontProcessInfo> {
		const processInfo: OneFrontProcessInfo = new OneFrontProcessInfo()
		processInfo.containerId = containerId
		processInfo.workItemId = workItemId
		Object.values((await this.getDemandes(containerId, headers)).processes).find((processes)=> {
			let selectedProcessInstance: FrontProcessInstances =  Object.values(processes.processInstances).find((processInstance)=> {
				let selectedWorkitemInstance:FrontWorkItemInstance = Object.values(processInstance.workitemInstances).find((workitem)=> {
					if(workitem?.workItemId == workItemId){
						processInfo.nodeId = workitem.nodeId
						processInfo.nodeInstanceId = workitem.nodeInstanceId
						processInfo.workItemId = workitem.workItemId
						processInfo.workItemName = workitem.workItemName
						processInfo.workItemParams = workitem.workItemParams
						processInfo.workItemState = workitem.workItemState
						processInfo.processInstanceId = workitem.processInstanceId
					}

					return workitem?.workItemId == workItemId} )!
					if(selectedWorkitemInstance?.processInstanceId === processInstance.processInstanceId ){
						processInfo.processInstanceDiagram = processInstance.diagram
						processInfo.processInstanceInitiator = processInstance.initiator
						processInfo.processInstanceState = processInstance.processInstanceState
						processInfo.processName = processInstance.processName
						processInfo.processId = processInstance.processId
						processInfo.processInstanceSlaDueDate = processInstance.slaDueDate
						processInfo.processInstancestartDate = processInstance.startDate
						processInfo.processInstanceVersion = processInstance.version
					}
					return selectedWorkitemInstance?.processInstanceId === processInstance.processInstanceId 
			}
		)!
			if(selectedProcessInstance?.processId === processes.processId){
				processInfo.diagram = processes.diagram
				processInfo.processName = processes.processName
				processInfo.processVersion = processes.processVersion
			}
			return selectedProcessInstance?.processId === processes.processId
		})
		return processInfo
	}

	async getProcessByProcessInstanceId(processInstanceId: number, containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<any> {
		return Object.values((await this.getDemandes(containerId, headers)).processes).find((processes)=> Object.values(processes.processInstances).some((processInstance)=> Object.values(processInstance.processInstanceId == processInstanceId)))
	}

	async getProcessByProcessId(processId: string, containerId: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<any> {
		return Object.values((await this.getDemandes(containerId, headers)).processes).find((processes)=> Object.values(processes.processId == processId))
	}
}

export { FrontDemande };
