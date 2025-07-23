import {
	AuthenticationRestAdapter,
	SessionCookieAdapter,
    ContainerRestAdapter,
	ProcessRestAdapter,
	ProcessInstanceRestAdapter,
	TaskRestAdapter,
	WorkItemsRestAdapter,
	FormRestAdapter,
	GroupRestAdapter,
	DocumentRestAdapter,
	DiagramRestAdapter,
	DefaultConfigAdapter
} from "@jbpm/adapters";

import {DefaultConfig ,Account, Container, ProcessInstance, Task, WorkItems, Form, Diagram, FrontDemande, Group, Document, IDefaultConfigAPI, IContainerAPI, IAccountAPI, IProcessInstanceAPI, ITaskAPI, IWorkItemsAPI, IFormAPI, IDiagramAPI, IGroupAPI, IFrontDemandeAPI, IDocumentAPI, Process, IProcessAPI } from "@jbpm/domain";

// Ajouter un adapter localStorage simple
class LocalStorageSessionAdapter {
  storeValue(key: string, value: string, duration: number): void {
    localStorage.setItem(key, value);
  }
  getValue(key: string): string {
    return localStorage.getItem(key) || '';
  }
  flush(): void {
    localStorage.clear();
  }
}

namespace AppLoader {
	const sessionAdapter = new LocalStorageSessionAdapter();
	const defaultConfigAdapter = new DefaultConfigAdapter();
	const authenticationAdater = new AuthenticationRestAdapter();

	const defaultConfig = new DefaultConfig(defaultConfigAdapter);
	const account = new Account(defaultConfig, authenticationAdater, sessionAdapter);
	const container = new Container(
			defaultConfig,
			new ContainerRestAdapter(),
		);

	const processInstance = new ProcessInstance(
			defaultConfig,
			new ProcessInstanceRestAdapter()
		)

	const task = new Task(
			defaultConfig,
			new TaskRestAdapter()
		)

	const workItems = new WorkItems(
			defaultConfig,
			new WorkItemsRestAdapter()
		)

	const form = new Form(
			defaultConfig,
			new FormRestAdapter()
		)

	const diagram = new Diagram(
			defaultConfig,
			new DiagramRestAdapter()
		)

	const frontDemande = new FrontDemande(
			defaultConfig,
			account,
			container,
			processInstance,
			task,
			diagram
		)

	const group = new Group(
			defaultConfig,
			new GroupRestAdapter()
		)
	
	const document = new Document(
			defaultConfig,
			new DocumentRestAdapter()
		)

	const process = new Process(
			defaultConfig,
			new ProcessRestAdapter()
		)
	/**
	 * Return account domain instance
	 *
	 * @returns {IAccountAPI} account domain
	 */
	export function getAccount(): IAccountAPI {
		return account;
	}
	
	/**
	 * Return default config domain instance
	 *
	 * @returns {IDefaultConfigAPI} default config domain
	 */
	export function getDefaultConfig(): IDefaultConfigAPI {
		return defaultConfig;
	}

	/**
	 * Return container domain instance
	 *
	 * @returns {IContainerAPI} container domain
	 */
	export function getContainer(): IContainerAPI {
		return container;
	}

	/**
	 * Return process instance domain instance
	 *
	 * @returns {IProcessInstanceAPI} process instance domain
	 */
	export function getProcessInstance(): IProcessInstanceAPI {
		return processInstance;
	}

	/**
	 * Return task instance domain instance
	 *
	 * @returns {ITaskAPI} task instance domain
	 */
	export function getTask(): ITaskAPI {
		return task;
	}

	/**
	 * Return work items domain instance
	 *
	 * @returns {IWorkItemsAPI} work items domain
	 */
	export function getWorkItems(): IWorkItemsAPI {
		return workItems;
	}

	/**
	 * Return form domain instance
	 *
	 * @returns {IFormAPI} form domain
	 */
	export function getForm(): IFormAPI {
		return form;
	}

	/**
	 * Return diagram domain instance
	 *
	 * @returns {IDiagramAPI} diagram domain
	 */
	export function getDiagram(): IDiagramAPI {
		return diagram;
	}

	/**
	 * Return frontDemande domain instance
	 *
	 * @returns {IFrontDemandeAPI} domain
	 */
	export function getFrontDemande(): IFrontDemandeAPI {
		return frontDemande;
	}

	/**
	 * Return Group domain instance
	 *
	 * @returns {IGroupAPI} domain
	 */
	export function getGroup(): IGroupAPI {
		return group;
	}

	/**
	 * Return Process domain instance
	 *
	 * @returns {IProcessAPI} domain
	 */
	export function getProcess(): IProcessAPI {
		return process;
	}

	/**
	 * Return Document domain instance
	 *
	 * @returns {IDocumentAPI} domain
	 */
	export function getDocument(): IDocumentAPI {
		return document;
	}
}

export { AppLoader };
