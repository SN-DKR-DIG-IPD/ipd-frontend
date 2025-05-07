import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { WorkItemsRestAdapter } from "./ports/spi/stubs/work-items-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";
import { WorkItems } from "./work-items";

describe("Completed work item domain service", () => {
	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let workItems: WorkItems;
	const consoleSpy = vi.spyOn(console, 'log')
	const containerId = 'evaluation_1.0.0-SNAPSHOT'
	const processInstanceId = 65
	const workItemId = 68
	const bodyJSON = {
		performance: 18
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


		workItems = new WorkItems(
			defaultConfig,
			new WorkItemsRestAdapter()
		);
	});

	test("should display work items info: ", async () => {
		const workitemInfo = await workItems.displayWorkitemInfo(containerId, processInstanceId, workItemId);
		console.log('work item info: ', workitemInfo);
    	expect(consoleSpy).toHaveBeenLastCalledWith('work item info: ', workitemInfo);
		expect(workitemInfo).not.toBeNull();
	});

	test("should complete work item of process intance", async () => {
		const completedWorkItemId = await workItems.completeWorkItemOfProcessInstance(containerId, processInstanceId, workItemId, bodyJSON);
		console.log('completed work item id: ', completedWorkItemId);
    	expect(consoleSpy).toHaveBeenLastCalledWith('completed work item id: ', completedWorkItemId);
		expect(completedWorkItemId).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});

