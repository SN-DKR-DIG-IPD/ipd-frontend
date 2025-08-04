import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject, OnDestroy } from '@angular/core';
import { ProcessType } from '@jbpm/domain';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcessInstanceService } from '../../../shared/services/process-instance.service';
import { ContainerService } from '../../../shared/services/container.service';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../../shared/services/task.service';
import { FormAPI } from '../../../injections';
import { IFormAPI } from '@jbpm/domain';
import { UnifiedAuthService } from '../../../core/service/unified-auth.service';

// Interface pour les données du formulaire
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  textarea: string;
  profilePic: File | null;
}

// Interface pour les données passées au dialog
interface DialogData {
  processType?: ProcessType;
  containerId?: string;
}

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.scss'
})
export class NewRequestComponent implements OnChanges, OnInit, OnDestroy {
  @Input() demande: ProcessType | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() onStartNewProcess = new EventEmitter();

  // Process data
  processName = '';
  processVersion = '';
  selectedContainerId: string = '';
  selectedProcessId: string = '';

  // Containers and processes
  containers: any[] = [];
  processes: any[] = [];

  // Form state
  formState: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    textarea: '',
    profilePic: null
  };

  // UI state
  isDragging = false;
  isSubmitting = false;
  isSubmitted = false;
  currentSection = 0;

  // Loading states
  isLoadingContainers = false;
  isLoadingProcesses = false;

  // Wizard state
  step: 1 | 2 = 1;
  isLoading = false;
  errorMsg = '';

  // Pour le formulaire dynamique
  processInstanceId: number | null = null;
  userTaskId: number | null = null;
  userTaskContainerId: string | null = null;
  taskForm: string = '';
  closeModifModal: boolean = true;
  // Supprimer la propriété userTaskFormHtml et toute logique liée à getTaskFormHtml
  // Préparer les propriétés nécessaires pour passer containerId et taskId au composant dynamique

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<NewRequestComponent>,
    private processInstanceService: ProcessInstanceService,
    private containerService: ContainerService,
    private taskService: TaskService,
    @Inject(FormAPI) private formAPI: IFormAPI,
    private unifiedAuthService: UnifiedAuthService
  ) {}

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['demande'] && this.demande) {
      this.processName = this.demande['process-name'] || '';
      this.processVersion = this.demande['process-version'] || '';
    }
  }

  /**
   * Initialize component with data from dialog
   */
  private async initializeComponent(): Promise<void> {
    try {
      this.isLoadingContainers = true;
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();

      // Load containers
      const result = await this.containerService.listContainers();
      this.containers = result || [];

      // Set selected container based on data passed
      if (this.data?.containerId) {
        this.selectedContainerId = this.data.containerId;
      } else if (this.containers.length > 0) {
        this.selectedContainerId = this.containers[0]['container-id'];
      }

      // Load processes for selected container
      if (this.selectedContainerId) {
        await this.onContainerChange();
      }

      // Set selected process based on data passed
      if (this.data?.processType) {
        this.selectedProcessId = this.data.processType['process-id'];
        this.processName = this.data.processType['process-name'];
        this.processVersion = this.data.processType['process-version'];
      } else if (this.processes.length > 0) {
        this.selectedProcessId = this.processes[0]['process-id'];
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du composant:', error);
    } finally {
      this.isLoadingContainers = false;
    }
  }

  /**
   * Handle container change
   */
  async onContainerChange(): Promise<void> {
    if (!this.selectedContainerId) return;

    try {
      this.isLoadingProcesses = true;
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      this.processes = await this.containerService.getProcessDefinitions(this.selectedContainerId, authHeaders);
      // Ajout debug
      console.log('DEBUG process definitions:', this.processes);
      if (this.processes.length > 0 && !this.selectedProcessId) {
        this.selectedProcessId = this.processes[0]['process-id'];
      }
      if (this.processes.length === 0) {
        this.errorMsg = 'Aucun modèle de processus disponible dans ce container.';
      }
    } catch (error) {
      console.error('Erreur lors du chargement des processus:', error);
      this.errorMsg = 'Erreur lors du chargement des modèles de processus.';
    } finally {
      this.isLoadingProcesses = false;
    }
  }

  /**
   * Étape 1 : Démarrer le process (instance)
   */
  async startProcessWizard(): Promise<void> {
    this.isLoading = true;
    this.errorMsg = '';
    try {
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      // Création de l'instance
      const processInstanceId = await this.processInstanceService.createOneProcessInstance(
        this.selectedContainerId,
        this.selectedProcessId,
        {},
        authHeaders
      );
      this.processInstanceId = processInstanceId;
      // Récupérer la première tâche utilisateur
      const userTasks = await this.taskService.getTasksForProcessInstance(processInstanceId, authHeaders);
      const taskList = userTasks['task-summary'] || [];
      const firstUserTask = taskList.find((t: any) => t['task-status'] === 'Reserved' || t['task-status'] === 'Ready' || t['task-status'] === 'En cours');
      if (!firstUserTask) {
        this.errorMsg = 'Aucune tâche utilisateur trouvée pour cette instance.';
        this.isLoading = false;
        return;
      }
      this.userTaskId = firstUserTask['task-id'];
      this.userTaskContainerId = firstUserTask['task-container-id'] || this.selectedContainerId;
      
      // Récupérer le formulaire HTML pour ModifComponent
      const htmlHeaders = {
        'Content-Type': 'text/html',
        'Accept': 'text/html'
      };
      
      // Récupérer le formulaire HTML
      if (this.userTaskContainerId && this.userTaskId) {
        console.log('🔍 NewRequestComponent: Récupération du formulaire pour:', this.userTaskContainerId, this.userTaskId);
        this.taskForm = await this.formAPI.getTaskInstanceForm(this.userTaskContainerId, this.userTaskId, htmlHeaders);
        console.log('🔍 NewRequestComponent: Formulaire récupéré:', this.taskForm ? this.taskForm.substring(0, 200) + '...' : 'null');
      }
      
      if (!this.taskForm) {
        this.errorMsg = 'Aucun formulaire trouvé pour cette tâche.';
        this.isLoading = false;
        return;
      }
      
      console.log('✅ NewRequestComponent: Formulaire prêt, ouverture de la modale');
      console.log('✅ NewRequestComponent: taskInfo:', { containerId: this.userTaskContainerId, taskId: this.userTaskId });
      console.log('✅ NewRequestComponent: closeModifModal avant:', this.closeModifModal);
      
      this.closeModifModal = false;
      console.log('✅ NewRequestComponent: closeModifModal après:', this.closeModifModal);
      this.step = 2;
    } catch (error: any) {
      this.errorMsg = error?.message || 'Erreur lors du démarrage du processus.';
    } finally {
      this.isLoading = false;
    }
  }



  /**
   * Appelé quand la tâche utilisateur est complétée dans <app-modif>
   */
  onTaskCompleted() {
    this.dialogRef.close('created');
  }



  /**
   * Close dialog
   */
  onclose(): void {
    this.close.emit();
    this.dialogRef.close();
  }

  /**
   * Exit process (alias for onclose)
   */
  exitProcess(): void {
    this.onclose();
  }

  /**
   * Navigation methods
   */
  goToNextSection(): void {
    if (this.currentSection < 2) {
    this.currentSection += 1;
    }
  }

  goToPreviousSection(): void {
    if (this.currentSection > 0) {
    this.currentSection -= 1;
    }
  }

  /**
   * File handling methods
   */
  setDragging(value: boolean): void {
    this.isDragging = value;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.formState.profilePic = input.files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.formState.profilePic = event.dataTransfer.files[0];
    }
  }

  /**
   * Utility methods
   */
  get Math() {
    return Math;
  }

  /**
   * Form validation
   */
  isFormValid(): boolean {
    return !!(this.formState.firstName && this.formState.lastName && this.formState.email);
  }

  /**
   * Get current section title
   */
  getCurrentSectionTitle(): string {
    const titles = ['Informations personnelles', 'Détails de la demande', 'Confirmation'];
    return titles[this.currentSection] || '';
  }
}