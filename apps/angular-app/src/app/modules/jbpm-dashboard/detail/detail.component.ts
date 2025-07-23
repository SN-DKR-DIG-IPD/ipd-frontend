import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { TaskInstanceType } from '@jbpm/domain';
import { Subject } from 'rxjs';

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
  isDetailsExpanded = false;
  isHistoryExpanded = true;

  // Loading states
  isLoading = false;

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.priority = this.getPriority(this.requestDetail['task-priority']);
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
   * Complete task
   */
  completeTask(): void {
    const completionEvent: TaskCompletionEvent = {
      taskId: this.requestDetail['task-id'],
      containerId: this.requestDetail['task-container-id']
    };
    this.onCompleteTask.emit(completionEvent);
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


