import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { FrontDemande } from "./front-demande";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IContainerAPI, IDefaultConfigAPI, IDiagramAPI, IProcessInstanceAPI } from "./ports/api";
import { Container } from "./container";
import { ContainerRestAdapter } from "./ports/spi/stubs/container-rest-adapter";
import { ProcessInstance } from "./process-instance";
import { ProcessInstanceRestAdapter } from "./ports/spi/stubs/process-instance-rest-adapter";
import { Diagram } from "./diagram";
import { DiagramRestAdapter } from "./ports/spi/stubs/diagram-rest-adapter";
import { FrontWorkItemInstance } from "./modeles/front-liste-demandes-modele";
import { Task } from "./task";
import { TaskRestAdapter } from "./ports/spi/stubs/task-rest-adapter";

describe("FrontDemande domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let container: IContainerAPI;
	let processInstance: IProcessInstanceAPI;
	let diagram: IDiagramAPI;
	let account: Account;
	let task: Task;
	let xmlSvgHeader: HeadersInit;
	let frontDemande: FrontDemande;
	const containerId = 'evaluation_1.0.0-SNAPSHOT';
	// const caseDefId = 1;
	// const taskInstanceId = 97;
	const processId = 'evaluation';
	const processInstanceId = 131;
	const workItemId = 161;
	beforeAll(() => {
		defaultConfigAdapter = new DefaultConfigAdapter();
		defaultConfig = new DefaultConfig(defaultConfigAdapter);
		defaultConfig.setAPIBaseUrl('http://localhost:8080/kie-server/services/rest/')
		account = new Account(
				defaultConfig,
				new AuthenticationInMemAdapter(),
				new SessionInMemAdapter()
			);
		
		(async()=> {
			await account.authenticate('wbadmin', 'wbadmin')
			defaultConfig.setDefaultHeaders({ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
			 });

			container = new Container(
				defaultConfig,
				new ContainerRestAdapter()
			);
			processInstance = new ProcessInstance(
				defaultConfig,
				new ProcessInstanceRestAdapter()
			);
			diagram = new Diagram(
				defaultConfig,
				new DiagramRestAdapter()
			);
  			xmlSvgHeader= {
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'application/svg+xml',
				'Content-Type': 'application/svg+xml'
			};
			task = new Task(
			defaultConfig,
			new TaskRestAdapter()
		);
			frontDemande = new FrontDemande(
				defaultConfig,
				account,
				container,
				processInstance,
				task,
				diagram,
				xmlSvgHeader
			);
		})()
		


	});

	test("should get demandes", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const demandes = await frontDemande.getDemandes(containerId)
		const processes = await frontDemande.getProcesses(containerId)
		const processInstances = await frontDemande.getProcessInstances(containerId)
		const workitems : Array<{[key: string]: FrontWorkItemInstance;}> = []
		for( let processInstance of Object.values(processInstances)){
			processInstances[processInstance.processInstanceId].workitemInstances = await frontDemande.getworkitemInstances(containerId, processInstance.processInstanceId)
			workitems.push(await frontDemande.getworkitemInstances(containerId, processInstance.processInstanceId))
		}
		// for( let workitem of workitems){
		// 	for(let item of Object.values(workitem)){
		// 		processInstances[item.processInstanceId].workitemInstances[item.workItemId] = item
		// 	}
		// }
    	expect(consoleSpy).toHaveBeenLastCalledWith('demandes: ', demandes);
		// console.log('processes: ', processes);
    	// expect(consoleSpy).toHaveBeenLastCalledWith('processes: ', processes);
		// console.log('processInstances: ', processInstances);
    	// expect(consoleSpy).toHaveBeenLastCalledWith('processInstances: ', processInstances);
		// console.log('workitems: ', workitems);
    	// expect(consoleSpy).toHaveBeenLastCalledWith('workitems: ', workitems);
		expect(demandes).not.toBeNull();
	});

	test("should get process by processId", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const process = await frontDemande.getProcessByProcessId(processId, containerId)
		console.log('process by processId: ', process);
    	expect(consoleSpy).toHaveBeenLastCalledWith('process by processId: ', process);
	});

	test("should get process by processInstanceId", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const process = await frontDemande.getProcessByProcessInstanceId(processInstanceId, containerId)
		console.log('process by processInstanceId: ', process);
    	expect(consoleSpy).toHaveBeenLastCalledWith('process by processInstanceId: ', process);
	});

	test("should get process by workItemId", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const process = await frontDemande.getProcessByWorkItemId(workItemId, containerId)
		console.log('process by workItemId: ', process);
    	expect(consoleSpy).toHaveBeenLastCalledWith('process by workItemId: ', process);
	});

	afterAll(() => {
		account.logout()
	})
});
