import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Diagram } from "./diagram";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { DiagramRestAdapter } from "./ports/spi/stubs/diagram-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";

describe("Diagram domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let diagram: Diagram;
	const containerId = 'evaluation_1.0.0-SNAPSHOT';
	const caseDefId = 1;
	const processId = 'evaluation';
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
			 })
		})()
		
		diagram = new Diagram(
			defaultConfig,
			new DiagramRestAdapter()
		);

	});

	test("should get process diagram form", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const processDiagramForm = await diagram.getProcessDiagram(containerId, processId, 
			{ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'application/svg+xml',
				'Content-Type': 'application/xml;charset=UTF-8'
			}
		);
    	expect(consoleSpy).toHaveBeenLastCalledWith('process diagram form: ', processDiagramForm);
		expect(processDiagramForm).not.toBeNull();
	});

	test("should get process instance diagram form", async () => {
		const processInstanceDiagram = await diagram.getProcessInstanceDiagram(containerId, caseDefId,
			{ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'text/html',
				'Content-Type': 'text/html'
			}
		)
		expect(processInstanceDiagram).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});
