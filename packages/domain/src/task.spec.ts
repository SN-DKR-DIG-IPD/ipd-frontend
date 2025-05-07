import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { TaskRestAdapter } from "./ports/spi/stubs/task-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";
import { Task } from "./task";

describe("Task domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let task: Task;
	const consoleSpy = vi.spyOn(console, 'log')
	const taskInstanceId = 67
	const variableName = 'reason'


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


		task = new Task(
			defaultConfig,
			new TaskRestAdapter()
		);
	});

	test("should display one task instance detail", async () => {
		const taskInstanceDetail = await task.displayOneTaskInstanceDetail(taskInstanceId);
		console.log('task instance detail: ', taskInstanceDetail);
    	expect(consoleSpy).toHaveBeenLastCalledWith('task instance detail: ', taskInstanceDetail);
		expect(taskInstanceDetail).not.toBeNull();
	});

	test("should display all tasks as admin", async () => {
		const allTasks = await task.displayAllTasksAsAdmin();
		console.log('all tasks: ', allTasks);
    	expect(consoleSpy).toHaveBeenLastCalledWith('all tasks: ', allTasks);
		expect(allTasks).not.toBeNull();
	});

	test("should display connected user task", async () => {
		const connectedUserTasks = await task.displayConnectedUserTasks()
		expect(connectedUserTasks).not.toBeNull();
	});

	test("should display one task instance info", async () => {
		const taskInstanceInfo = await task.displayOneTaskInstanceInfo(taskInstanceId);
		expect(taskInstanceInfo).not.toBeNull();
	});
	
	test("should display one task instance events", async () => {
		const processesInstances = await task.displayOneTaskInstanceEvents(taskInstanceId);
		expect(processesInstances).not.toBeNull();
	});

	test("should display task instances having this variable", async () => {
		const taskInstances = await task.displayTaskInstancesHavingThisVariable(variableName);
		expect(taskInstances).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});

