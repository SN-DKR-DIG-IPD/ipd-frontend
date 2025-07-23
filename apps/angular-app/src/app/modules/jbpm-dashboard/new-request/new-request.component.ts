import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject, OnDestroy } from '@angular/core';
import { ProcessType } from '@jbpm/domain';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcessInstanceService } from '../../../shared/services/process-instance.service';
import { ContainerService } from '../../../shared/services/container.service';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../../shared/services/task.service';

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
  // Supprimer la propriété userTaskFormHtml et toute logique liée à getTaskFormHtml
  // Préparer les propriétés nécessaires pour passer containerId et taskId au composant dynamique

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<NewRequestComponent>,
    private processInstanceService: ProcessInstanceService,
    private containerService: ContainerService,
    private taskService: TaskService
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
      const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);

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
      const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);
      this.processes = await this.containerService.getProcessDefinitions(this.selectedContainerId, defaultHeader);
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
      const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);
      // Création de l'instance
      const processInstanceId = await this.processInstanceService.createOneProcessInstance(
        this.selectedContainerId,
        this.selectedProcessId,
        {},
        defaultHeader
      );
      this.processInstanceId = processInstanceId;
      // Récupérer la première tâche utilisateur
      const userTasks = await this.taskService.getTasksForProcessInstance(processInstanceId, defaultHeader);
      const taskList = userTasks['task-summary'] || [];
      const firstUserTask = taskList.find((t: any) => t['task-status'] === 'Reserved' || t['task-status'] === 'Ready' || t['task-status'] === 'En cours');
      if (!firstUserTask) {
        this.errorMsg = 'Aucune tâche utilisateur trouvée pour cette instance.';
        this.isLoading = false;
        return;
      }
      this.userTaskId = firstUserTask['task-id'];
      this.userTaskContainerId = firstUserTask['task-container-id'] || this.selectedContainerId;
      // Log de debug pour l'URL du formulaire dynamique
      console.log('DEBUG getTaskFormHtml URL:', `${this.userTaskContainerId}, ${this.userTaskId}`);
      // Récupérer le formulaire HTML dynamique
      // this.userTaskFormHtml = await this.taskService.getTaskFormHtml(this.userTaskContainerId!, this.userTaskId, defaultHeader);
      // if (!this.userTaskFormHtml) {
      //   this.errorMsg = 'Aucun formulaire dynamique trouvé pour cette tâche. Vérifiez la configuration du process BPMN.';
      //   this.isLoading = false;
      //   return;
      // }
      this.step = 2;
    } catch (error: any) {
      this.errorMsg = error?.message || 'Erreur lors du démarrage du processus.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Étape 2 : Soumettre le formulaire dynamique pour compléter la tâche
   */
  async submitUserTaskForm(): Promise<void> {
    // this.isSubmittingTask = true; // This line is no longer needed as the form is handled by <app-task-form>
    this.errorMsg = '';
    try {
      const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);
      // Récupérer les données du formulaire dynamique (par ex. via FormData ou querySelector)
      const form = document.getElementById('jbpm-task-form') as HTMLFormElement;
      if (!form) {
        this.errorMsg = 'Formulaire introuvable.';
        // this.isSubmittingTask = false; // This line is no longer needed
        return;
      }
      const formData = new FormData(form);
      const data: any = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      // Compléter la tâche
      await this.taskService.completeTask(this.userTaskId!, this.userTaskContainerId!, data, defaultHeader);
      this.dialogRef.close('created');
    } catch (error: any) {
      this.errorMsg = error?.message || 'Erreur lors de la soumission du formulaire.';
    } finally {
      // this.isSubmittingTask = false; // This line is no longer needed
    }
  }

  /**
   * Appelé quand la tâche utilisateur est complétée dans <app-task-form>
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
