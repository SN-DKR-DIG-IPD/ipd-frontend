import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Inject } from '@angular/core';
import { TaskService } from 'src/app/shared/services/task.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/services/user.service';
import { FormAPI } from '../../injections';
import { IFormAPI } from '@jbpm/domain';
import { UnifiedAuthService } from '../../core/service/unified-auth.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styles: [`
    .task-form-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      min-height: 400px;
      overflow-y: auto;
    }
    
    .jbpm-form-content {
      width: 100%;
    }
    
    .jbpm-form-content form {
      width: 100%;
    }
    
    .jbpm-form-content input,
    .jbpm-form-content select,
    .jbpm-form-content textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .jbpm-form-content label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .jbpm-form-content button {
      background-color: #3b82f6;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .jbpm-form-content button:hover {
      background-color: #2563eb;
    }
  `]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() containerId!: string;
  @Input() taskId!: number;
  @Output() completed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  formGroup!: FormGroup;
  isLoading = false;
  errorMsg = '';
  inputVariables: any = {};
  submitted = false;
  fields: {key: string, type: string}[] = [];
  formHtml: string = '';
  sanitizedFormHtml: SafeHtml = '';
  formUrl: string = '';
  safeFormUrl: SafeResourceUrl = '';
  hasPermission = false;
  currentUser: any = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(FormAPI) public formAPI: IFormAPI,
    private unifiedAuthService: UnifiedAuthService
  ) {}

  async ngOnInit() {
    if (this.taskId && this.containerId) {
      // Rafraîchir les informations de l'utilisateur
      await this.userService.initializeCurrentUser();
      this.currentUser = this.userService.getCurrentUser();
      console.log('Utilisateur actuel:', this.currentUser);
      
      // Vérifier les permissions selon le groupe avant de charger le formulaire
      await this.checkPermissions();
      if (this.hasPermission) {
        await this.loadForm();
      } else {
        this.errorMsg = `Vous n'avez pas les permissions nécessaires pour accéder à cette tâche. 
                        Groupe requis: ${this.getRequiredGroup()}`;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recharger le formulaire si containerId ou taskId changent
    if ((changes['containerId'] || changes['taskId']) && this.containerId && this.taskId) {
      this.loadForm();
    }
  }

  async loadForm() {
    if (!this.containerId || !this.taskId) {
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    
    try {
      console.log('Chargement du formulaire pour la tâche:', this.taskId, 'container:', this.containerId);
      
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      const htmlHeaders = {
        'Content-Type': 'text/html',
        'Accept': 'text/html'
      };
      
      console.log('FormAPI: Récupération du formulaire avec headers:', htmlHeaders);
      const htmlContent = await this.formAPI.getTaskInstanceForm(this.containerId, this.taskId, htmlHeaders);
      
      if (htmlContent && htmlContent.length > 0) {
        this.formHtml = htmlContent;
        this.sanitizedFormHtml = this.sanitizer.bypassSecurityTrustHtml(this.formHtml);
        console.log('Formulaire HTML chargé avec succès via FormAPI');
      } else {
        // Fallback : essayer de récupérer les variables de la tâche pour créer un formulaire dynamique
        console.log('Aucun formulaire HTML trouvé, tentative de création d\'un formulaire dynamique...');
        const taskVariables = await this.taskService.getTaskInputVariables(this.taskId, this.containerId);
        
        if (taskVariables && Object.keys(taskVariables).length > 0) {
          this.createDynamicForm(taskVariables);
          console.log('Formulaire dynamique créé avec succès');
        } else {
          this.errorMsg = 'Aucun formulaire trouvé pour cette tâche. Vérifiez la configuration du process BPMN.';
        }
      }
      
      this.isLoading = false;
    } catch (err: any) {
      console.error('Erreur loadForm avec FormAPI:', err);
      
      // Fallback en cas d'erreur : essayer de créer un formulaire dynamique
      try {
        console.log('Tentative de récupération des variables de la tâche en fallback...');
        const taskVariables = await this.taskService.getTaskInputVariables(this.taskId, this.containerId);
        
        if (taskVariables && Object.keys(taskVariables).length > 0) {
          this.createDynamicForm(taskVariables);
          console.log('Formulaire dynamique créé en fallback');
          this.isLoading = false;
          return;
        }
      } catch (fallbackErr: any) {
        console.error('Erreur lors de la récupération des variables en fallback:', fallbackErr);
      }
      
      this.errorMsg = 'Erreur lors du chargement du formulaire : ' + (err.message || err);
      this.isLoading = false;
    }
  }

  private createDynamicForm(variables: any) {
    // Créer un formulaire HTML dynamique basé sur les variables
    let formHtml = '<form id="dynamic-task-form" class="space-y-4">';
    
    for (const [key, value] of Object.entries(variables)) {
      const fieldType = this.getFieldType(value);
      formHtml += `
        <div class="form-field">
          <label for="${key}" class="block text-sm font-medium text-gray-700">${key}</label>
          ${this.generateFieldHtml(key, fieldType, value)}
        </div>
      `;
    }
    
    formHtml += `
      <div class="form-actions mt-6">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Soumettre
        </button>
      </div>
    </form>`;
    
    this.formHtml = formHtml;
    this.sanitizedFormHtml = this.sanitizer.bypassSecurityTrustHtml(this.formHtml);
  }

  private getFieldType(value: any): string {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'string' && value.length > 100) return 'textarea';
    return 'text';
  }

  private generateFieldHtml(key: string, type: string, value: any): string {
    switch (type) {
      case 'number':
        return `<input type="number" id="${key}" name="${key}" value="${value}" class="w-full px-3 py-2 border border-gray-300 rounded-md">`;
      case 'checkbox':
        return `<input type="checkbox" id="${key}" name="${key}" ${value ? 'checked' : ''} class="h-4 w-4 text-blue-600">`;
      case 'textarea':
        return `<textarea id="${key}" name="${key}" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md">${value}</textarea>`;
      default:
        return `<input type="text" id="${key}" name="${key}" value="${value}" class="w-full px-3 py-2 border border-gray-300 rounded-md">`;
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) return;
    this.isLoading = true;
    this.errorMsg = '';
    try {
      await this.taskService.completeTask(this.taskId, this.containerId, this.formGroup.value);
      this.completed.emit();
      // Optionnel : notifier le parent ou rafraîchir la liste
    } catch (err: any) {
      this.errorMsg = 'Erreur lors de la soumission : ' + (err.message || err);
    }
    this.isLoading = false;
  }

  // Méthode pour gérer la soumission du formulaire dynamique
  async onSubmitDynamicForm(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.errorMsg = '';
    
    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const data: any = {};
      
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      console.log('Données du formulaire à soumettre:', data);
      
      await this.taskService.completeTask(this.taskId, this.containerId, data);
      this.completed.emit();
      console.log('Tâche complétée avec succès');
    } catch (err: any) {
      this.errorMsg = 'Erreur lors de la soumission : ' + (err.message || err);
      console.error('Erreur soumission:', err);
    }
    
    this.isLoading = false;
  }

  // Méthode pour gérer les clics dans le formulaire HTML
  handleFormClick(event: Event) {
    // Intercepter les clics sur les boutons de soumission du formulaire HTML
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      event.preventDefault();
      event.stopPropagation();
      
      const button = target.tagName === 'BUTTON' ? target as HTMLButtonElement : target.closest('button') as HTMLButtonElement;
      if (button && (button.type === 'submit' || button.textContent?.toLowerCase().includes('soumettre'))) {
        this.submitHtmlForm();
      }
    }
  }

  // Méthode pour annuler
  cancel() {
    this.cancelled.emit();
  }

  // Méthode pour soumettre le formulaire HTML
  async submitHtmlForm() {
    this.isLoading = true;
    this.errorMsg = '';
    
    try {
      // Récupérer les données du formulaire HTML
      const formElement = document.querySelector('.jbpm-form-content form') as HTMLFormElement;
      if (formElement) {
        const formData = new FormData(formElement);
        const data: any = {};
        
        formData.forEach((value, key) => {
          data[key] = value;
        });
        
        console.log('Données du formulaire HTML à soumettre:', data);
        
        await this.taskService.completeTask(this.taskId, this.containerId, data);
        this.completed.emit();
        console.log('Tâche complétée avec succès');
      } else {
        // Si pas de formulaire trouvé, essayer de récupérer les variables d'entrée
        const taskVariables = await this.taskService.getTaskInputVariables(this.taskId, this.containerId);
        if (taskVariables) {
          await this.taskService.completeTask(this.taskId, this.containerId, taskVariables);
          this.completed.emit();
          console.log('Tâche complétée avec les variables par défaut');
        } else {
          throw new Error('Aucune donnée à soumettre trouvée');
        }
      }
    } catch (err: any) {
      this.errorMsg = 'Erreur lors de la soumission : ' + (err.message || err);
      console.error('Erreur soumission formulaire HTML:', err);
    }
    
    this.isLoading = false;
  }

  /**
   * Vérifie les permissions de l'utilisateur pour cette tâche selon son groupe
   */
  private async checkPermissions(): Promise<void> {
    try {
      // Récupérer les détails de la tâche pour obtenir son nom
      const taskDetails = await this.taskService.getTaskDetails(this.taskId, this.containerId);
      const taskName = taskDetails['task-name'] || '';
      
      console.log('=== DIAGNOSTIC PERMISSIONS ===');
      console.log('Nom de la tâche:', taskName);
      console.log('Utilisateur actuel:', this.currentUser);
      console.log('Groupes de l\'utilisateur:', this.currentUser?.groups);
      console.log('Tâche contient "selfEvaluation":', taskName.includes('selfEvaluation'));
      console.log('Tâche contient "pmEvaluation":', taskName.includes('pmEvaluation'));
      console.log('Tâche contient "hrEvaluation":', taskName.includes('hrEvaluation'));
      
      // Vérifier si l'utilisateur peut accéder à cette tâche selon son groupe
      this.hasPermission = this.userService.canAccessTask(taskName);
      
      console.log('Permission accordée:', this.hasPermission);
      console.log('=== FIN DIAGNOSTIC ===');
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      this.hasPermission = false;
    }
  }

  /**
   * Obtient le groupe requis pour cette tâche
   */
  private getRequiredGroup(): string {
    // Cette méthode pourrait être améliorée pour retourner le groupe exact requis
    // Pour l'instant, on retourne une indication basée sur les patterns connus
    if (this.currentUser?.groups) {
      if (this.currentUser.groups.includes('PM')) return 'PM';
      if (this.currentUser.groups.includes('HR')) return 'HR';
      if (this.currentUser.groups.includes('employe')) return 'employe';
    }
    return 'Groupe approprié';
  }
} 