import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { TaskInstanceType } from '@jbpm/domain';
import { Subject } from 'rxjs';
import { TaskService } from '../../../shared/services/task.service';

// Interface pour les détails de la tâche
interface TaskDetail {
  'task-id': number;
  'task-name': string;
  'task-subject': string;
  'task-description': string;
  'task-status': string;
  'task-priority': number;
  'task-is-skipable': boolean;
  'task-actual-owner': string;
  'task-created-by': string | undefined;
  'task-created-on': { 'java.util.Date': number };
  'task-activation-time': { 'java.util.Date': number };
  'task-expiration-time': { 'java.util.Date': number } | undefined;
  'task-proc-inst-id': number;
  'task-proc-def-id': string;
  'task-container-id': string;
  'task-parent-id': number;
  'correlation-key': string;
  'process-type': number;
}

// Interface pour les informations utilisateur
interface UserTaskInfo {
  [key: string]: { [key: string]: any };
}

// Interface pour l'événement de complétion
interface TaskCompletionEvent {
  taskId: number;
  containerId: string;
  formType?: string;
  userGroups?: string[];
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  @Input() requestDetail: TaskDetail = {
    'task-id': -2,
    'task-name': '',
    'task-subject': '',
    'task-description': '',
    'task-status': 'Unknown',
    'task-priority': -2,
    'task-is-skipable': false,
    'task-actual-owner': '',
    'task-created-by': undefined,
    'task-created-on': {
      'java.util.Date': Date.now()
    },
    'task-activation-time': {
      'java.util.Date': Date.now()
    },
    'task-expiration-time': undefined,
    'task-proc-inst-id': -2,
    'task-proc-def-id': '',
    'task-container-id': '',
    'task-parent-id': -2,
    'correlation-key': '',
    'process-type': -2
  };

  @Input() currentUserTaskInfos: UserTaskInfo = {};
  @Output() modalShowChange = new EventEmitter<boolean>();
  @Output() onCompleteTask = new EventEmitter<TaskCompletionEvent>();
  @Input() closeModal = true;

  // UI state
  priority = '';
  scale = 1;
  isMaximized = false;
  isDocumentsExpanded = false;
  isDetailsExpanded = true; // Déplier par défaut pour voir le diagramme
  isHistoryExpanded = true;

  // Loading states
  isLoading = false;
  
  // Task Form Modal
  showTaskForm = false;
  currentFormType = '';
  currentTaskId = 0;

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();
  
  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.priority = this.getPriority(this.requestDetail['task-priority']);
    
    // Debug: Vérifier si le diagramme est présent
    const taskId = this.requestDetail['task-id'];
    const userTaskInfo = this.currentUserTaskInfos[taskId];
    
    console.log('🔍 DetailComponent - Task ID:', taskId);
    console.log('🔍 DetailComponent - UserTaskInfo:', userTaskInfo);
    
    if (userTaskInfo && userTaskInfo['processInstanceDiagram']) {
      console.log('✅ Diagramme trouvé:', userTaskInfo['processInstanceDiagram'].substring(0, 200) + '...');
    } else {
      console.log('❌ Aucun diagramme trouvé pour la tâche:', taskId);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Close modal
   */
  onclose(): void {
    this.closeModal = true;
    this.modalShowChange.emit(this.closeModal);
  }

  /**
   * Handle close modal event
   */
  setCloseModal(event: Event): void {
    event.preventDefault();
    this.onclose();
  }

  /**
   * Parse XML string
   */
  parseXml(xmlStr: string): Document | null {
    if (window.DOMParser) {
      return new window.DOMParser().parseFromString(xmlStr, 'text/xml');
    }
    return null;
  }

  /**
   * Set scale
   */
  setScale(scale: number): void {
    this.scale = scale;
  }

  /**
   * Set maximized state
   */
  setMaximized(maximized: boolean): void {
    this.isMaximized = maximized;
  }

  /**
   * Complete task - Approche simple comme jbpmPortal
   */
  completeTask(): void {
    console.log('🚀 === DÉBUT COMPLETE TASK (Approche jbpmPortal) ===');
    console.log('🔍 Émission de l\'événement avec les paramètres de la tâche');
    
    // Utiliser directement les paramètres de requestDetail comme jbpmPortal
    const taskId = this.requestDetail['task-id'];
    const containerId = this.requestDetail['task-container-id'];
    
    console.log('📋 Paramètres de la tâche:', { taskId, containerId });
    
    // Émettre l'événement pour que le composant parent gère la récupération du formulaire
    this.onCompleteTask.emit({
      taskId: taskId,
      containerId: containerId
    });
  }
  
  /**
   * Fallback vers le formulaire simple si la récupération des tâches échoue
   */
  private fallbackToSimpleForm(userGroups: string[]): void {
    console.log('🔄 Utilisation du fallback vers le formulaire simple');
    
    // Récupérer le nom de la tâche depuis les données
    const taskId = this.requestDetail['task-id'];
    const userTaskInfo = this.currentUserTaskInfos[taskId];
    const taskName = userTaskInfo?.['processInfo']?.processName || this.requestDetail['task-name'] || '';
    
    // Déterminer le type de formulaire à ouvrir selon le groupe ET le nom de la tâche
    let formType = '';
    
    if (userGroups.includes('PM')) {
      if (taskName.toLowerCase().includes('pm') || taskName.toLowerCase().includes('manager')) {
        formType = 'PM Evaluation';
      } else if (taskName.toLowerCase().includes('self')) {
        formType = 'Self Evaluation';
      } else {
        formType = 'PM Evaluation'; // Par défaut pour PM
      }
      console.log('✅ Utilisateur PM - Formulaire (fallback):', formType);
    } else if (userGroups.includes('HR')) {
      if (taskName.toLowerCase().includes('hr')) {
        formType = 'HR Evaluation';
      } else {
        formType = 'HR Evaluation'; // Par défaut pour HR
      }
      console.log('✅ Utilisateur HR - Formulaire (fallback):', formType);
    } else {
      formType = 'Self Evaluation';
      console.log('✅ Utilisateur standard - Formulaire (fallback):', formType);
    }
    
    this.currentFormType = formType;
    this.currentTaskId = this.requestDetail['task-id']; // Utiliser l'ID de l'instance comme fallback
    
    // Ouvrir la modale du formulaire
    this.showTaskForm = true;
  }
  
  /**
   * Ferme la modale du formulaire
   */
  closeTaskForm(): void {
    this.showTaskForm = false;
    this.currentFormType = '';
    this.currentTaskId = 0;
  }
  
  /**
   * Gère la complétion du formulaire
   */
  onTaskFormCompleted(): void {
    console.log('✅ Formulaire complété avec succès');
    this.closeTaskForm();
    // Émettre l'événement de complétion
    const completionEvent: TaskCompletionEvent = {
      taskId: this.requestDetail['task-id'],
      containerId: this.requestDetail['task-container-id']
    };
    this.onCompleteTask.emit(completionEvent);
  }
  
  /**
   * Gère l'annulation du formulaire
   */
  onTaskFormCancelled(): void {
    console.log('❌ Formulaire annulé');
    this.closeTaskForm();
  }
  
  /**
   * Obtient l'ID de tâche approprié pour le formulaire
   * Le problème est que nous avons l'ID de l'instance, mais nous avons besoin de l'ID de la tâche
   */
  getTaskIdForForm(): number {
    // Pour l'instant, nous utilisons l'ID de l'instance comme fallback
    // Mais idéalement, nous devrions récupérer l'ID de la tâche depuis jBPM
    const instanceId = this.requestDetail['task-id'];
    console.log('🔍 Utilisation de l\'ID d\'instance comme ID de tâche:', instanceId);
    return instanceId;
  }
  
  /**
   * Obtient le nom d'utilisateur actuel
   */
  getCurrentUsername(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    return currentUser.preferred_username || currentUser.name || 'Utilisateur';
  }
  
  /**
   * Obtient les groupes de l'utilisateur actuel
   */
  getCurrentUserGroups(): string {
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    const groups = currentUser.groups || [];
    return groups.join(', ') || 'Aucun groupe';
  }
  
  /**
   * Soumet le formulaire simple
   */
  submitSimpleForm(): void {
    console.log('✅ Soumission du formulaire simple:', this.currentFormType);
    
    // Simuler la soumission du formulaire
    alert(`Formulaire ${this.currentFormType} soumis avec succès !`);
    
    // Fermer la modale et émettre l'événement de complétion
    this.onTaskFormCompleted();
  }

  /**
   * Toggle section visibility
   */
  toggleSection(section: 'documents' | 'details' | 'history'): void {
    switch (section) {
      case 'documents':
        this.isDocumentsExpanded = !this.isDocumentsExpanded;
        break;
      case 'details':
        this.isDetailsExpanded = !this.isDetailsExpanded;
        break;
      case 'history':
        this.isHistoryExpanded = !this.isHistoryExpanded;
        break;
    }
  }

  /**
   * Get priority string from number
   */
  getPriority(priority: number): string {
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    return priorities[priority] || priorities[0];
  }

  /**
   * Format date for display
   */
  formatDate(dateObj: { 'java.util.Date': number } | undefined): string {
    if (!dateObj || !dateObj['java.util.Date']) {
      return '-';
    }
    const date = new Date(dateObj['java.util.Date']);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get task status class for styling
   */
  getTaskStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'en cours':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
      case 'prêt':
        return 'bg-yellow-100 text-yellow-800';
      case 'reserved':
      case 'réservé':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get priority class for styling
   */
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Check if task is completed
   */
  isTaskCompleted(): boolean {
    const status = this.requestDetail['task-status'].toLowerCase();
    return status === 'completed' || status === 'terminé';
  }

  /**
   * Check if task can be completed
   */
  canCompleteTask(): boolean {
    return !this.isTaskCompleted() && this.requestDetail['task-id'] > 0;
  }
}


