import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, HostListener, OnChanges, SimpleChanges, OnDestroy, Renderer2 } from '@angular/core';
import { ScriptService } from '../../../shared/services/script-service';
import { DocumentInstancesType, DocumentInstanceType, TasKStatus } from '@jbpm/domain';
import { saveAs } from 'file-saver';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { DocumentAPI } from '../../../injections';
import { IDocumentAPI } from '@jbpm/domain';
import { Inject } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { Subject, takeUntil } from 'rxjs';

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
  selector: 'app-modif',
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
})
export class ModifComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('modalForm') modalForm: ElementRef | undefined;
  
  @Input() form = '';
  @Input() taskStatus = TasKStatus.Unknow;
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
    'task-created-on': { 'java.util.Date': Date.now() },
    'task-activation-time': { 'java.util.Date': Date.now() },
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

  // Constants
  TaskStatus = TasKStatus;
  
  // Script resources
  private scriptResources = [
    'http://localhost:8080/kie-server/services/rest/server/files/patternfly/js/jquery.min.js',
    'http://localhost:8080/kie-server/services/rest/server/files/patternfly/js/patternfly.min.js',
    'http://localhost:8080/kie-server/services/rest/server/files/bootstrap/js/bootstrap-slider.js',
    'http://localhost:8080/kie-server/services/rest/server/files/bootstrap/js/bootstrap-tagsinput.js',
    'http://localhost:8080/kie-server/services/rest/server/files/js/forms.js',
    'http://localhost:8080/kie-server/services/rest/server/files/js/kieserver-ui.js'
  ];

  // UI state
  priority = '';
  scale = 1;
  isMaximized = false;
  isDocumentsExpanded = true;
  isDetailsExpanded = true;
  isHistoryExpanded = true;

  // Loading states
  isLoading = false;
  isLoadingDocument = false;

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  // Default header
  private defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);

  constructor(
    @Inject(DocumentAPI) public documentAPI: IDocumentAPI,
    private scriptService: ScriptService,
    private safeHtml: SafeHtmlPipe,
    private taskService: TaskService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.priority = this.getPriority(this.requestDetail['task-priority']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.loadForm();
    }
  }

  /**
   * Load form content
   */
  loadForm(): void {
    const modalFormNode = this.modalForm?.nativeElement as HTMLElement;
    if (!modalFormNode) return;

    // Clear existing content
    while (modalFormNode.firstChild) {
      modalFormNode.removeChild(modalFormNode.lastChild!);
    }

    // Patch du HTML pour remplacer toutes les URLs absolues par /jbpm/api
    let safeFormHtml = this.form;
    // Supprime toutes les balises <iframe> (empêche l'injection d'iframe)
    safeFormHtml = safeFormHtml.replace(/<iframe[\s\S]*?<\/iframe>/gi, function(match) {
      console.warn('Iframe supprimée du formulaire jBPM:', match);
      return '';
    });
    // Remplace dans src, href, action, data-src, etc. (attributs HTML)
    safeFormHtml = safeFormHtml.replace(/(src|href|action|data-src)=(['"])https?:\/\/(jbpm\.localhost|localhost):8082/gi, '$1=$2/jbpm/api');
    // Remplace aussi les URLs brutes dans le HTML
    safeFormHtml = safeFormHtml.replace(/https?:\/\/(jbpm\.localhost|localhost):8082/gi, '/jbpm/api');

    // Injecte le HTML patché
    modalFormNode.insertAdjacentHTML('beforeend', safeFormHtml);
    this.loadFormScript(modalFormNode);
  }

  /**
   * Load form scripts sequentially
   */
  private loadFormScript(modalFormNode: HTMLElement): void {
    const dynamicScriptResources: HTMLScriptElement[] = Array.from(modalFormNode.children)
      .filter(child => child instanceof HTMLScriptElement) as HTMLScriptElement[];

    this.loadScriptsSequentially(this.scriptResources, () => {
      // Load dynamic scripts
      dynamicScriptResources.forEach((resource: HTMLScriptElement) => {
        const scriptElement = this.scriptService.loadJsScript(this.renderer, resource.src, true);
               scriptElement!.onload = () => {
          console.log('Dynamic script loaded:', resource.src);
        };
          scriptElement!.onerror = (e) => {
          console.error('Error loading dynamic script:', e);
        };
      });

      // Load AJAX interceptor after a delay
          setTimeout(() => {
        const ajaxInterceptorScript = this.scriptService.loadJsScript(
          this.renderer,
          this.addAjaxAuthorisationHeaderInterceptorScript()
        );
            ajaxInterceptorScript!.onload = () => {
          console.log('AJAX interceptor loaded');
        };
      }, 2000);
    });
  }

  /**
   * Load scripts sequentially
   */
  private loadScriptsSequentially(scripts: string[], callback: () => void): void {
    if (scripts.length === 0) {
      callback();
      return;
    }

    const script = scripts.shift()!;
    const scriptElement = this.scriptService.loadJsScript(this.renderer, script);
    scriptElement!.onload = () => {
      this.loadScriptsSequentially(scripts, callback);
    };
    scriptElement!.onerror = () => {
      console.warn('Failed to load script:', script);
      this.loadScriptsSequentially(scripts, callback);
    };
  }

  /**
   * Get document details
   */
  async getDocumentDetail(documentName: string): Promise<DocumentInstanceType | null> {
    try {
      this.isLoadingDocument = true;
      let currentPage = 0;
      const numberOfDoc = 10;
      const paginationLimit = 5;

      while (currentPage < paginationLimit) {
        const documents: DocumentInstancesType = await this.documentAPI.listAllDocuments(
          currentPage, 
          numberOfDoc, 
          this.defaultHeader
        );
        
        const doc = documents['document-instances'].find(doc => 
          doc['document-name'] === documentName
        );
        
        if (doc) {
          return doc;
        }
        currentPage++;
      }
      return null;
    } catch (error) {
      console.error('Error getting document detail:', error);
      return null;
    } finally {
      this.isLoadingDocument = false;
    }
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
   * Handle click events for document downloads
   */
  @HostListener('click', ['$event.target']) 
  async onClick(element: any): Promise<void> {
    if (!element || !element.innerText) return;

    const fileExtensions = ['txt', 'pdf', 'docx', 'jpeg', 'jpg', 'png'];
    const fileName = element.innerText;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtensions.includes(fileExtension)) {
      await this.downloadDocument(fileName, element);
    }
  }

  /**
   * Download document
   */
  private async downloadDocument(fileName: string, element: any): Promise<void> {
    try {
      this.isLoadingDocument = true;
      
      const doc = await this.getDocumentDetail(fileName);
      if (!doc) {
        console.error('Document not found:', fileName);
        return;
      }

      const streamHeader = {
        ...this.defaultHeader,
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/octet-stream'
      };

      const docContent = await this.documentAPI.displayDocumentContentById(
        doc['document-id'], 
        streamHeader
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([docContent], { type: 'application/octet-stream' }));
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.setAttribute('style', 'display: none');
      link.href = url;
      link.download = fileName;
      link.click();
        window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      this.isLoadingDocument = false;
    }
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
   * Get priority string from number
   */
  getPriority(priority: number): string {
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    return priorities[priority] || priorities[0];
  }

  /**
   * Add AJAX authorization header interceptor script
   */
  private addAjaxAuthorisationHeaderInterceptorScript(): string {
    return `
      (function() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState === 1) {
              this.setRequestHeader('Authorization', '${this.defaultHeader.Authorization}');
            }
          });
          return originalOpen.call(this, method, url, async, user, password);
        };
      })();
    `;
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


