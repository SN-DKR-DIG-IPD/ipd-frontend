import { Component, OnInit, ChangeDetectionStrategy, Input, HostListener,AfterViewChecked,   ChangeDetectorRef, Inject } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { IContainerAPI, IFrontDemandeAPI, IWorkItemsAPI, FrontListeDemandesType, FrontWorkItemInstance, OneFrontProcessInfo, TaskInstances,
ITaskAPI,
IProcessInstanceAPI, IDiagramAPI, IFormAPI, IProcessAPI, IGroupAPI,
ProcessType,
Timestamp} from '@jbpm/domain';
import { ContainerAPI, FrontDemandeAPI, TaskAPI, ProcessInstanceAPI, ProcessAPI, WorkItemsAPI, DiagramAPI, FormAPI, GroupAPI } from '../../../injections';
import {UserService} from "../../../core/service/user/user.service";
import {firstValueFrom, Observable} from "rxjs";

import {TaskFilters} from "../../../data/model/taskFilters.model";
import {FilterableTask} from "../../../data/model/FilterableTask.model";
import { Demande } from '../../../shared/models/demande';
import { RoleService } from '../../../core/service/role/role.service';
import {async} from "@angular/core/testing";



interface TaskInstance {
  'task-id': number;
  'task-status': string;
  'task-priority': number;
  'task-created-on': Timestamp;
  'task-expiration-time'?: Timestamp;
  'task-proc-inst-id': number;
  'task-proc-def-id': string;
  'task-container-id': string;
  'task-workitem-id'?: number;
}



@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('filterAnimation', [
      state('void', style({ opacity: 0, height: '0px' })),
      state('*', style({ opacity: 1, height: '*' })),
      transition('void <=> *', [
          animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class DemandeComponent implements OnInit, AfterViewChecked {
  filteredRequests:Demande[] = []
 // users:any[] = []
  defaultStatus = 'status=Created&status=Ready&status=Reserved&status=InProgress&status=Suspended&status=Completed&status=Reserved&status=Created&status=Failed&status=Error&status=Exited&status=Obsolete'

  frontDemandes : FrontListeDemandesType[] = []
    workitemInstances: FrontWorkItemInstance[] = []
    processInfos: OneFrontProcessInfo[] = []
    currentUserTask: TaskInstances = {"task-summary":[]}
    currentUserTaskInfos: {[key: string]: {[key:string]: any}} = {}
    defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!)
    closeDetailModal = true;
    closeModifModal = true;
    taskForm : any = null
    processes: ProcessType[] = []
    createdProcessId = -2

    isLoading = true;
    skeletonArray = new Array(5);
    currentPage = 1;
    itemsPerPage = 10;
    totalElement = 0;
    isPageChanging = false;

    filtersVisible: boolean = false;
    isDropdownOpen = false;

    users: string[] = [];
    groups: string[] =[];



   businessCentralHeader = Object.assign({},JSON.parse(sessionStorage.getItem('defaultHeader')!),{

  });


    @Input() group: string|undefined

    constructor(
    private cdRef: ChangeDetectorRef,
		@Inject(ContainerAPI) private containerAPI: IContainerAPI,
		@Inject(TaskAPI) public taskAPI: ITaskAPI,
		@Inject(FormAPI) public formAPI: IFormAPI,
    @Inject(WorkItemsAPI) public workItemsAPI: IWorkItemsAPI,
    @Inject(DiagramAPI) public diagramAPI: IDiagramAPI,
    @Inject(ProcessInstanceAPI) public processInstanceAPI: IProcessInstanceAPI,
		@Inject(FrontDemandeAPI) private frontDemandeAPI: IFrontDemandeAPI,
    @Inject(GroupAPI) private groupAPI: IGroupAPI,

    private userService: UserService,
    private roleService: RoleService
    //private taskFilter: TaskFilters
  ) { }

  activeFilters: TaskFilters = {
    type: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  };

  filters: string[] = ['Type', 'Status','Priority'];


  ngOnInit() {
    setTimeout(() => {
      (async () => {

         // this.getAllUser();
        // await this.groupAPI.listAllGroups()
        await this.displayProcesses()
        await this.displayUserTasks()
        // await this.groupAPI.listUserGroups('john',)

        this.isLoading = false;

        this.filteredRequests = [...this.requests];

        // this.getAllUser()
        //
        // this.getUserGroups('wbadmin')
        // this.getAllRoles();
        // this.createUserWithRolesAndGroups()

      })()
    }, 50);
  }

  getAllUser(){
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('liste des utilisateur',data);

        this.isLoading = false;
      },
      error: (error) => {
        console.log(error.message)
        this.isLoading = false;
      }
    })
  }

  getUserGroups(userName:string){
    this.userService.getUserGroups(userName).subscribe({
      next: (groups) => {
        this.groups = groups
        console.log("** the user groups is" , groups)
      }
    })
  }

  createUserWithRolesAndGroups(){
    // mock data for testing
    const name = 'Eddy';
    const roles = ['admin', 'developer'];
    // const groups = ['groups1', 'groups2'];

    this.userService.createUserWithRolesAndGroups(name,roles).subscribe({
      next:  (response) => {
        console.log("utilisateur ", response);
        alert('created succesfully '+ response)
      },
      error:(error) => {
        alert('creation user error'+error.message)
      },
    }
    );
    this.getAllUser();
  }

  //testing for role
  getAllRoles() {
    const roles = this.roleService.findAllRoles().subscribe({
        next : (roles) => {
          console.log("** the groups of role are",roles)
        }
    })
    return roles;
  }


  // getUsers(): Observable<any> {
  //   return this.http.get('http://localhost:8080/business-central/rest/users', { withCredentials: true });
  // }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  async displayProcesses(){

      const containers = await this.containerAPI.listContainers(this.defaultHeader);

      for(let container of containers.result['kie-containers']['kie-container']){
         let process = await this.containerAPI.displayAllProcesses(container['container-id'], this.defaultHeader)
         for(let elements of Object.values(process)){
            for(let element of elements){
              this.processes.push(element)
            }
         }
      }
  }

  async displayUserTasks(page:number = 1 , itemsPerPage:number = 10){

      if(this.isPageChanging) {
        return;
      }

      this.isLoading = true;
      this.isPageChanging = true;

      try {
        const status = `${this.defaultStatus}&pageSize=${itemsPerPage}&page=${page -1}`
        const taskReponse = this.group && this.group === 'group'
          ? await this.taskAPI.displayConnectedUserPotentialTasks(this.defaultHeader, status)
          : await this.taskAPI.displayConnectedUserTasks(this.defaultHeader, status);

        // update data
        this.currentUserTask = taskReponse;
        this.currentPage = page;
        this.itemsPerPage = itemsPerPage;

        // update information task details
        await this.updateTaskDetails();

        //update totalElement if available
        this.totalElement = taskReponse['task-summary'].length ;
      }catch (error ) {
        console.log('task not available ', error);
      }finally {
        this.isLoading = false;
        this.isPageChanging = false;
        this.cdRef.detectChanges();
    }
  }



  private async updateTaskDetails() {
    this.currentUserTaskInfos = {};
    let xmlSvgHeader = Object.assign({}, this.defaultHeader, {
      'Content-Type': 'application/xml;charset=UTF-8',
      'Accept': 'application/svg+xml'
    });

    for (let e of this.currentUserTask['task-summary']) {
      this.currentUserTaskInfos[e['task-id']] = {};

      this.currentUserTaskInfos[e['task-id']]['processInfo'] = await this.frontDemandeAPI.getProcessByProcessId(
        e['task-proc-def-id'],
        e['task-container-id'],
        this.defaultHeader
      );

      this.currentUserTaskInfos[e['task-id']]['processInstanceDetail'] = await this.processInstanceAPI.displayOneProcessInstanceDetail(
        e['task-container-id'],
        e['task-proc-inst-id'],
        this.defaultHeader
      );

      if (e['task-workitem-id']) {
        this.currentUserTaskInfos[e['task-id']]['workItemInfo'] = await this.workItemsAPI.displayWorkitemInfo(
          e['task-container-id'],
          e['task-proc-inst-id'],
          e['task-workitem-id'],
          this.defaultHeader
        );
      }

      this.currentUserTaskInfos[e['task-id']]['processInstanceDiagram'] = await this.diagramAPI.getProcessInstanceDiagram(
        e['task-container-id'],
        e['task-proc-inst-id'],
        xmlSvgHeader
      );

      this.currentUserTaskInfos[e['task-id']]['processDiagram'] = await this.diagramAPI.getProcessDiagram(
        e['task-container-id'],
        e['task-proc-def-id'],
        xmlSvgHeader
      );
    }
  }

  async nextPage() {
    if (this.currentPage < this.totalElement && !this.isPageChanging) {
      const nextPage = this.currentPage + 1;
      await this.displayUserTasks(nextPage, this.itemsPerPage);
    }
  }

  async previousPage() {
      if (this.currentPage > 1 && !this.isPageChanging) {
        const prevPage = this.currentPage - 1;
        await this.displayUserTasks(prevPage, this.itemsPerPage);
      }
  }

  async gotoPage(page:number) {
    if (page >= 1 && this.totalElement && page !== this.currentPage && !this.isPageChanging) {
      await this.displayUserTasks(page, this.itemsPerPage);
    }
  }

  async updateItemsPerPage(numbItem:number) {
      const itemsSize = parseInt(numbItem.toString(), 10);
      if (!isNaN(itemsSize) && itemsSize !== this.itemsPerPage && !this.isPageChanging) {
        await this.displayUserTasks(1,itemsSize);
      }
  }

  // selectedFilters: { [key: string]: string } = {
  //   'Type': '',
  //   'Status': '',
  //   'Priority': ''
  // };

  dateDebut: string = '';
  dateFin: string = '';
  showDateDebutPicker = false;
  showDateFinPicker = false;

  async applyFilters() {
    this.isLoading = true;

    try {

      const statusQuery = `${this.defaultStatus}&pageSize=${this.itemsPerPage}&page=${this.currentPage - 1}`;

      // let statusQuery = this.activeFilters.status
      //   ? `status=${this.activeFilters.status}`
      //   : this.defaultStatus;

      // statusQuery += `&pageSize=${this.itemsPerPage}&page=${this.currentPage - 1}`;

      const taskResponse = this.group && this.group === 'group'
        ? await this.taskAPI.displayConnectedUserPotentialTasks(this.defaultHeader, statusQuery)
        : await this.taskAPI.displayConnectedUserTasks(this.defaultHeader, statusQuery);

      //update filters
      let filteredTasks = taskResponse['task-summary'].filter((task: TaskInstance) => {
        // const typeMatch = this.activeFilters.type
        //   ? this.currentUserTaskInfos[task['task-id']]?.['processInstanceDetail']?.['process-name'] === this.activeFilters.type
        //   : true;

        const matchesType = !this.activeFilters.type ||
          this.currentUserTaskInfos[task['task-id']]?.['processInstanceDetail']?.['process-name'] === this.activeFilters.type;

        const matchesStatus = !this.activeFilters.status ||
          task['task-status'] === this.activeFilters.status;

        // const priorityMatch = this.activeFilters.priority
        //   ? this.getPriority(task['task-priority']) === this.activeFilters.priority
        //   : true;


        const matchesPriority = !this.activeFilters.priority ||
          this.getPriority(task['task-priority']) === this.activeFilters.priority;

        // const startDateMatch = this.activeFilters.startDate && task['task-created-on']
        //   ? new Date(task['task-created-on']['java.util.Date']) >= new Date(this.activeFilters.startDate)
        //   : true;

        const taskDate = task['task-created-on']
          ? new Date(task['task-created-on']['java.util.Date'])
          : null;

        const taskEndDate = task['task-expiration-time']
          ? new Date(task['task-expiration-time']['java.util.Date'])
          : null;

        // const endDateMatch = this.activeFilters.endDate && task['task-expiration-time']
        //   ? new Date(task['task-expiration-time']['java.util.Date']) <= new Date(this.activeFilters.endDate)
        //   : true;


        const matchesStartDate = !this.activeFilters.startDate ||
          (taskDate && taskDate >= new Date(this.activeFilters.startDate));

        const matchesEndDate = !this.activeFilters.endDate ||
          (taskEndDate && taskEndDate <= new Date(this.activeFilters.endDate));

        // return typeMatch && priorityMatch && startDateMatch && endDateMatch;
        return matchesType && matchesStatus && matchesPriority &&
          matchesStartDate && matchesEndDate;
      });

      this.currentUserTask = {
        'task-summary': filteredTasks
      };
      this.totalElement = filteredTasks.length;

      await this.updateTaskDetails();
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  onFilterChange(filterType: keyof TaskFilters, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.activeFilters[filterType] = value;

    // Log pour le débogage
    console.log(`Filtre ${filterType} changé pour:`, value);
    console.log('Tous les filtres actifs:', this.activeFilters);

    this.currentPage = 1;
    this.applyFilters();
  }

  resetFilters() {
    this.activeFilters = {
      type: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: ''
    };
    this.dateDebut = '';
    this.dateFin = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return Object.values(this.activeFilters).some(value => value !== '');
  }

  getActiveFiltersDisplay(): string[] {
    const activeFilters: string[] = [];

    if (this.activeFilters.type) {
      activeFilters.push(`Type: ${this.activeFilters.type}`);
    }
    if (this.activeFilters.status) {
      activeFilters.push(`Status: ${this.activeFilters.status}`);
    }
    if (this.activeFilters.priority) {
      activeFilters.push(`Priority: ${this.activeFilters.priority}`);
    }
    if (this.activeFilters.startDate) {
      activeFilters.push(`From: ${this.formatDate(this.activeFilters.startDate)}`);
    }
    if (this.activeFilters.endDate) {
      activeFilters.push(`To: ${this.formatDate(this.activeFilters.endDate)}`);
    }
    return activeFilters;
  }


  // onFilterChange(filter: string, value: string) {
  //   this.activeFilters[f] = value;
  //   // this.currentPage = 1;
  //   this.applyFilters();
  // }

  // onFilterChange(filterType: keyof TaskFilters, value: string) {
  //   this.activeFilters[filterType] = value;
  //
  //   this.currentPage = 1;
  //   this.applyFilters();
  // }

  handleDateChange(event: any, type: 'startDate' | 'endDate') {
    this.activeFilters[type] = event.target.value;
    console.log('**', event.target.value)
    this.applyFilters();
  }

  toggleDateDebutPicker() {
    this.showDateDebutPicker = !this.showDateDebutPicker;
  }

  toggleDateFinPicker() {
    this.showDateFinPicker = !this.showDateFinPicker;
  }

  // onDateDebutChange(event: any) {
  //   this.dateDebut = event.target.value;
  //   // this.showDateDebutPicker = false;
  //   // this.onDateChange();
  //   this.applyFilters();
  // }

  // onDateFinChange(event: any) {
  //   this.dateFin = event.target.value;
  //   // this.showDateFinPicker = false;
  //   // this.onDateChange();
  //   this.applyFilters()
  // }

  onDateChange() {
    this.applyFilters();
  }

  // Formater la date pour l'affichage
  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }


  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }



toggleDropdown () {
  this.isDropdownOpen= !this.isDropdownOpen
}

@HostListener('document:click', ['$event'])
handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-container')) {
    this.isDropdownOpen = false;
  }
}

// getFilterOptions(filter: string): string[] {
//   switch (filter) {
//     case 'Type':
//       return ['Financial commitments', 'Purchase order', 'Service request'];
//     case 'Status':
//       return ['Approved', 'Pending', 'InProgress', 'Completed', 'Rejected'];
//     case 'Priorité':
//       return ['HIGH', 'MEDIUM', 'LOW'];
//     default:
//       return [];
//   }
// }

getFilterOptions(filter: string): string[] {
  switch (filter) {
    case 'Type':
      return Array.from(new Set(
        Object.values(this.currentUserTaskInfos)
          .map(info => info?.['processInstanceDetail']?.['process-name'])
          .filter((name): name is string => name !== undefined && name !== null)
      ));
    case 'Status':
      return [
        'Created',
        'Ready',
        'Reserved',
        'InProgress',
        'Completed',
        'Failed',
        'Error',
        'Exited',
        'Obsolete'
      ];
    case 'Priority':
      return ['LOW', 'MEDIUM', 'HIGH'];
    default:
      return [];
  }
}



activeFilter: string | null = null;
  requests: Demande[] = [];
//   tableHeaders: string[] = [
//     'ID', 'Type', 'Request.TableHeaders.Status', 'Request.TableHeaders.StartDate', 'End date',
//     'Responsible', 'Priority', 'Approval', 'Completion rate'
//   ];

  tableHeaders = [
    { key: 'ID', label: 'ID' },
    { key: 'Type', label: 'Request.TableHeaders.Type' },
    { key: 'Status', label: 'Request.TableHeaders.Status' },
    { key: 'StartDate', label: 'Request.TableHeaders.StartDate' },
    { key: 'EndDate', label: 'Request.TableHeaders.EndDate' },
    { key: 'Responsible', label: 'Request.TableHeaders.Responsible' },
    { key: 'Priority', label: 'Request.TableHeaders.Priority' },
    { key: 'Approval', label: 'Request.TableHeaders.Approval' },
    { key: 'CompletionRate', label: 'Request.TableHeaders.CompletionRate' }
  ];




  demandes: string [] = ['IT', 'Financial Committementt' , 'school fees','IT', 'Financial Committementt' , 'school fees','IT', 'Financial Committementt' , 'school fees'];


  @Input() isOpen = false;
  isModalOpen = false;
  selectedRequest: any = null;
  selectedDemande: any = null;


  openDetailModal(request: any) {
    this.selectedRequest = request;
    this.closeDetailModal = false;
    console.log(this.selectedRequest)
  }

  setCloseDetailModal(e :any){
  this.closeDetailModal = e
    this.selectedRequest = null;
  }
  setCloseModifModal(e :any){
  this.closeModifModal = e
    this.taskForm = null;
    this.displayUserTasks()
  }

  closeModalDemande() {
    this.selectedDemande = null;
  }

  openAddFormModal(demande : any) {
    this.selectedDemande = demande;
    console.log(demande);

  }


  async startProcess(e: ProcessType){
   console.log('** e: ', e)
   console.log('** header: ', this.defaultHeader)
   this.createdProcessId= await this.processInstanceAPI.createOneProcessInstance(e['container-id'], e['process-id'], this.defaultHeader)
   console.log('** createdProcessId: ', this.createdProcessId)
   let createdProcessDetails = await this.processInstanceAPI.displayOneProcessInstanceDetail(e['container-id'], this.createdProcessId, this.defaultHeader)
   console.log('** created detail: ', createdProcessDetails)
   await this.completeTask({containerId: createdProcessDetails['container-id'], taskId: createdProcessDetails['active-user-tasks']['task-summary'][0]['task-id']})
  //  await this.completeTask({containerId: 'evaluation', taskId: 417})
  }


  async completeTask({containerId, taskId}:{containerId: string, taskId:number}){
      let htmlHeader = Object.assign({},this.defaultHeader,{
        'Content-Type': 'text/xml;charset=UTF-8',
        'Accept': 'text/html'
      })
    this.taskForm = await this.formAPI.getTaskInstanceForm(containerId, taskId, htmlHeader)
    this.setCloseDetailModal(true)
    this.closeModifModal = false
  }

  toggleFilter(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? null : filter;
  }

  getFilterClass(filter: string): string {
    return `flex items-center gap-2 px-3 py-2 rounded-lg transition-all
      ${this.activeFilter === filter ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}`;
  }

  // getStatusClass(status: string): string {
  //   const styles = {
  //     'InProgress': 'bg-[#EBF5FF] text-[#0066FF]',
  //     'PENDING': 'bg-gray-100 text-gray-600',
  //     'Reserved': 'bg-green-100 text-green-700',
  //     'COMPLETED': 'bg-green-100 text-green-700',
  //     'REJECTED': 'bg-red-100 text-red-700'
  //   };
  //   const normalizedStatus = status.trim().toUpperCase() as keyof typeof styles;
  //   return `inline-flex px-2 py-1 rounded-full text-xs font-medium ${styles[normalizedStatus] || styles['PENDING']}`;
  // }


  getStatusClass(status: string): { [key: string]: boolean } {
    const baseClasses = 'inline-flex px-2 py-1 rounded-full text-xs font-medium outline outline-1 border-slate-200';

    const statusStyles: { [key: string]: string } = {
      'INPROGRESS': `${baseClasses} bg-[#EBF5FF] text-orange-600`,
      'PENDING': `${baseClasses} bg-gray-100 text-gray-600`,
      'RESERVED': `${baseClasses} bg--100 text-green-700`,
      'COMPLETED': `${baseClasses} bg-green-300 text-green-700`,
      'REJECTED': `${baseClasses} bg-red-100 text-red-700`,
      'SUSPENDED': `${baseClasses} bg-red-100 text-red-700`


    };

    const normalizedStatus = status.trim().toUpperCase();
    const classString = statusStyles[normalizedStatus] || statusStyles['PENDING'];

    return classString.split(' ').reduce((acc, className) => {
      acc[className] = true;
      return acc;
    }, {} as { [key: string]: boolean });
  }

  getPriorityClass(priority: number): string {
    const styles = [
      'text-gray-600 opacity-75',
      'text-orange-600',
      'text-red-600',
    ];
    return `font-medium ${styles[priority] || styles[0]}`;
  }
  getPriority(priority: number){
        const priorities = [
        'LOW',
      'MEDIUM',
      'HIGH',
    ];
    return priorities[priority] || priorities[0];
  }

  getProgressClass(progress: string): string {
    const styles = {
      'INPROGRESS': 'bg-blue-600',
      'RESERVED': 'bg-green-500',
      'SUSPENDED': 'bg-red-700',
      'REJECTED': 'bg-red-500',
      'READY': 'bg-gray-200',

    };
    const normalizedStatus = progress.trim().toUpperCase() as keyof typeof styles;
    return `h-2 rounded-full transition-all duration-300 ${styles[normalizedStatus] || styles['READY']}`;
  }

  protected readonly async = async;
}

