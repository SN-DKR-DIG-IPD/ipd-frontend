import { InjectionToken } from '@angular/core';
import { IDefaultConfigAPI, IAccountAPI, IContainerAPI, IProcessAPI, IProcessInstanceAPI, ITaskAPI, IWorkItemsAPI, IFormAPI, IDiagramAPI, IFrontDemandeAPI, IGroupAPI, IDocumentAPI } from '@jbpm/domain';

const BPMDefaultConfigAPI = new InjectionToken<IDefaultConfigAPI>('BPM_DEFAULT_CONFIG_API');
const AccountAPI = new InjectionToken<IAccountAPI>('ACCOUNT_API');
const ContainerAPI = new InjectionToken<IContainerAPI>('CONTAINER_API');
const ProcessAPI = new InjectionToken<IProcessAPI>('PROCESS_API');
const ProcessInstanceAPI = new InjectionToken<IProcessInstanceAPI>('PROCESS_INSTANCE_API');
const TaskAPI = new InjectionToken<ITaskAPI>('TASK_INSTANCE_API');
const WorkItemsAPI = new InjectionToken<IWorkItemsAPI>('WORK_ITEMS_API');
const FormAPI = new InjectionToken<IFormAPI>('FORM_API');
const DiagramAPI = new InjectionToken<IDiagramAPI>('DIAGRAM_API');
const FrontDemandeAPI = new InjectionToken<IFrontDemandeAPI>('FRONT_DEMANDE_API');
const GroupAPI = new InjectionToken<IGroupAPI>('GROUP_API');
const DocumentAPI = new InjectionToken<IDocumentAPI>('DOCUMENT_API');

export { BPMDefaultConfigAPI, AccountAPI, ContainerAPI, ProcessInstanceAPI, TaskAPI, WorkItemsAPI, FormAPI, DiagramAPI, FrontDemandeAPI, GroupAPI, ProcessAPI, DocumentAPI };
