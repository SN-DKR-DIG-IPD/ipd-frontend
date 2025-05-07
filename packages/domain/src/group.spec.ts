import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Group } from "./group";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { GroupRestAdapter } from "./ports/spi/stubs/group-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";

describe("Group domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let group: Group;
	const containerId = 'evaluation_1.0.0-SNAPSHOT';
	const username = 'john'
	const processId = 'evaluation';
	beforeAll(() => {
		defaultConfigAdapter = new DefaultConfigAdapter();
		defaultConfig = new DefaultConfig(defaultConfigAdapter);
		defaultConfig.setAPIBaseUrl('http://localhost:8080/kie-server/services/rest/')
		defaultConfig.setBusinessCentralAPIBaseUrl('http://localhost:8080/business-central/rest/')
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
			 })
		})()
		
		group = new Group(
			defaultConfig,
			new GroupRestAdapter()
		);

	});

	test("should list all groups", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const groups = await group.listAllGroups();
		console.log('groups: ', groups);
    	expect(consoleSpy).toHaveBeenLastCalledWith('groups: ', groups);
		expect(groups).not.toBeNull();
	});

	test("should list all user groups", async () => {
		const caseDefForm = await group.listUserGroups(username)
		expect(caseDefForm).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});
