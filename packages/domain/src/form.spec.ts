import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Form } from "./form";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { FormRestAdapter } from "./ports/spi/stubs/form-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";

describe("Form domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let form: Form;
	const containerId = 'evaluation_1.0.0-SNAPSHOT';
	const caseDefId = 1;
	const taskInstanceId = 97;
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
		
		form = new Form(
			defaultConfig,
			new FormRestAdapter()
		);

	});

	test("should get task instance form", async () => {
		const consoleSpy = vi.spyOn(console, 'log')
		const taskInstanceForm = await form.getTaskInstanceForm(containerId, taskInstanceId, 
			{ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'text/html',
				'Content-Type': 'text/html'
			}
		);
    	expect(consoleSpy).toHaveBeenLastCalledWith('task instance form: ', taskInstanceForm);
		expect(taskInstanceForm).not.toBeNull();
	});

	test("should get case definition form", async () => {
		const caseDefForm = await form.getCaseDefinitionForm(containerId, caseDefId,
			{ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'text/html',
				'Content-Type': 'text/html'
			}
		)
		expect(caseDefForm).not.toBeNull();
	});

	test("should get process definition form", async () => {
		const processForm = await form.getProcessDefinitionForm(containerId, processId, 
			{ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'text/html',
				'Content-Type': 'text/html'
			}
		);
		expect(processForm).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});
