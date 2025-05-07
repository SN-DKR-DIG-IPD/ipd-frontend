import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { ProcessInstanceRestAdapter } from "./ports/spi/stubs/process-instance-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";
import { ProcessInstance } from "./process-instance";

describe("Process instance domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let processInstance: ProcessInstance;
	const consoleSpy = vi.spyOn(console, 'log')
	const containerId = 'evaluation_1.0.0-SNAPSHOT'
	const processId = 'evaluation'
	const processInstanceId = 131
	const initiator = 'wbadmin'
	const employee = 'john'
	const reason = 'Evaluation HR'
	const performance = null
	const bodyJSON = {
 						initiator,
 						employee,
 						reason,
 						performance
 					}

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
				'Content-Type': 'application/json'
			 })
		})()


		processInstance = new ProcessInstance(
			defaultConfig,
			new ProcessInstanceRestAdapter()
		);

	});

	test("should display one process instance detail", async () => {
		const processInstanceDetail = await processInstance.displayOneProcessInstanceDetail(containerId, processInstanceId);
		console.log('process instance detail: ', processInstanceDetail);
    	expect(consoleSpy).toHaveBeenLastCalledWith('process instance detail: ', processInstanceDetail);
		expect(processInstanceDetail).not.toBeNull();
	});

	test("should create one process instance", async () => {
		const createdProcessId = await processInstance.createOneProcessInstance(containerId,processId, bodyJSON);
		console.log('created process instance id: ', createdProcessId);
    	expect(consoleSpy).toHaveBeenLastCalledWith('created process instance id: ', createdProcessId);
		expect(createdProcessId).not.toBeNull();
	});

	test("should display all tasks of one process instance", async () => {
		const processes = await processInstance.displayAllTasksOfOneProcessInstance(processInstanceId)
		expect(processes).not.toBeNull();
	});

	test("should display all work items of one process instance", async () => {
		const processesInstances = await processInstance.displayAllWorkitemsOfOneProcessInstance(containerId, processInstanceId);
		console.log('all work items of process instance: ', processesInstances);
    	expect(consoleSpy).toHaveBeenLastCalledWith('all work items of process instance: ', processesInstances);
		expect(processesInstances).not.toBeNull();
	});
	
	afterAll(() => {
		account.logout()
	})
});

