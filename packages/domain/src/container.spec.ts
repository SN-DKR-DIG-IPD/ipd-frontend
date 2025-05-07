import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Container } from "./container";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { ContainerRestAdapter } from "./ports/spi/stubs/container-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";

describe("Container domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let container: Container;
	const containerId = 'evaluation_1.0.0-SNAPSHOT'
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
		
		container = new Container(
			defaultConfig,
			new ContainerRestAdapter()
		);

	});

	test("should list containers", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const containers = await container.listContainers();
    	expect(consoleSpy).toHaveBeenLastCalledWith('containers: ', containers);
		expect(containers).not.toBeNull();
	});

	test("should display one container detail", async () => {
		const containerDetail = await container.displayOneContainerDetail(containerId);
		expect(containerDetail).not.toBeNull();
	});

	test("should display all processes", async () => {
		const processes = await container.displayAllProcesses(containerId);
		expect(processes).not.toBeNull();
	});

	test("should display all process instances", async () => {
		const processesInstances = await container.displayAllProcessInstances(containerId);
		expect(processesInstances).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});
