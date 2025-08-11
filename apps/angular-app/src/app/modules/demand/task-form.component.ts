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
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      min-height: 400px;
      overflow-y: auto;
    }
    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .form-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }
    .pill-group { display: flex; gap: 8px; flex-wrap: wrap; }
    .pill {
      padding: 6px 12px;
      border-radius: 8px;
      background: #ffffff;
      color: #374151;
      border: 1px solid #e5e7eb;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
      transition: all .15s ease;
    }
    .pill:hover { background: #f9fafb; border-color:#d1d5db; }
    .pill.primary { background:#2563eb; color:#fff; border-color:#1d4ed8; }
    .pill.primary:hover { background:#1d4ed8; }

    .footer-actions{
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn{ padding: 8px 14px; border-radius: 8px; font-weight: 500; cursor: pointer; }
    .btn.primary{ background:#2563eb; color:#fff; border:1px solid #1d4ed8; }
    .btn.primary:hover{ background:#1d4ed8; }
    .btn.ghost{ background:#f3f4f6; color:#374151; border:1px solid #e5e7eb; }
    .btn.ghost:hover{ background:#e5e7eb; }
    
    .jbpm-form-content {
      width: 100%;
      background: #ffffff !important;
      color: #111827 !important;
    }
    
    .jbpm-form-content form {
      width: 100%;
      background: #ffffff !important;
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
    public taskService: TaskService,
    private userService: UserService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(FormAPI) public formAPI: IFormAPI,
    private unifiedAuthService: UnifiedAuthService
  ) {}

  async ngOnInit() {
    if (this.taskId && this.containerId) {
      await this.loadForm();
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
      
      // Headers: pas de Content-Type pour GET HTML; Accept text/html
      const htmlHeaders = { 'Accept': 'text/html' } as Record<string, string>;
      // Ajouter explicitement le Bearer si disponible (certains adaptateurs FormAPI ne fusionnent pas automatiquement)
      try {
        const token = this.unifiedAuthService.getToken();
        if (token) {
          htmlHeaders['Authorization'] = `Bearer ${token}`;
        } else {
          const authHeaders = this.unifiedAuthService.getAuthHeaders();
          const authVal = authHeaders.get('Authorization');
          if (authVal) htmlHeaders['Authorization'] = authVal;
        }
      } catch {}
      
      console.log('FormAPI: Récupération du formulaire avec headers:', htmlHeaders);
      const htmlContent = await this.formAPI.getTaskInstanceForm(this.containerId, this.taskId, htmlHeaders);
      
      if (htmlContent && htmlContent.length > 0) {
        const cleanedHtml = this.cleanAndEnhanceFormHtml(htmlContent);
        this.formHtml = cleanedHtml;
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

  private cleanAndEnhanceFormHtml(html: string): string {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Supprimer les liens CSS/scripts/styles externes du formulaire (souvent non chargeables et causent des erreurs MIME)
      tempDiv.querySelectorAll('link[rel="stylesheet"], script').forEach(el => el.remove());
      // Garder les styles inline existants, mais injecter un style minimal pour grille
      const style = document.createElement('style');
      style.textContent = `
        .jbpm-form-content form { display:grid; grid-template-columns: 220px 1fr; gap: 12px 16px; }
        .jbpm-form-content form label { align-self:center; font-size:13px; color:#374151; }
        .jbpm-form-content input, .jbpm-form-content select, .jbpm-form-content textarea {
          width:100%; padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; background:#fff; color:#111827;
        }
        .jbpm-form-content button { padding:6px 10px; border-radius:6px; border:1px solid #e5e7eb; background:#f9fafb; cursor:pointer; }
        .jbpm-form-content button:hover { background:#f3f4f6; }
      `;
      tempDiv.prepend(style);

      // Neutraliser les onclick intégrés pour éviter l'exécution de JS externe
      tempDiv.querySelectorAll('[onclick]').forEach(el => el.removeAttribute('onclick'));

      // Réécrire les URLs kie-server absolues vers le proxy
      tempDiv.querySelectorAll('[src], [href], form').forEach((el: Element) => {
        const attr = (el.hasAttribute('src') ? 'src' : (el.hasAttribute('href') ? 'href' : (el.tagName.toLowerCase() === 'form' ? 'action' : '')));
        if (!attr) return;
        const val = (el as any).getAttribute(attr) as string;
        if (!val) return;
        const rewritten = val
          .replace(/https?:\/\/localhost:8080\/kie-server/gi, '/jbpm/api')
          .replace(/\/kie-server\//gi, '/jbpm/api/server/');
        if (rewritten !== val) (el as any).setAttribute(attr, rewritten);
      });

      // Neutraliser la soumission native du/ des formulaire(s)
      tempDiv.querySelectorAll('form').forEach((f: Element) => {
        (f as HTMLFormElement).setAttribute('action', '');
        (f as HTMLFormElement).setAttribute('target', '_self');
        (f as HTMLFormElement).setAttribute('novalidate', '');
        (f as HTMLFormElement).addEventListener('submit', (e) => { e.preventDefault(); e.stopPropagation(); });
      });

      // Convertir les boutons submit en boutons normaux afin d'éviter la navigation
      tempDiv.querySelectorAll('input[type="submit"], button[type="submit"]').forEach((btn: Element) => {
        (btn as HTMLButtonElement).setAttribute('type', 'button');
        (btn as HTMLButtonElement).setAttribute('data-local-submit', 'true');
      });

      return tempDiv.innerHTML;
    } catch {
      return html;
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

  // Sauvegarde basique: extrait les champs présents et appelle l'API saveTaskData
  async saveCurrentForm(): Promise<void> {
    try {
      const container = document.querySelector('.jbpm-form-content');
      if (!container) return;
      const inputs = container.querySelectorAll('input, select, textarea');
      const data: any = {};
      inputs.forEach((el: any) => {
        if (!el.name) return;
        if (el.type === 'checkbox') data[el.name] = !!el.checked; else data[el.name] = el.value ?? '';
      });
      await this.taskService.saveTaskData(this.taskId, this.containerId, data);
    } catch (e) {
      console.warn('Save form error:', e);
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
    if (target.tagName === 'BUTTON' || target.closest('button') || (target as HTMLInputElement).type === 'submit') {
      event.preventDefault();
      event.stopPropagation();
      
      const button = target.tagName === 'BUTTON' ? target as HTMLButtonElement : target.closest('button') as HTMLButtonElement;
      if (button && (button.type === 'submit' || button.textContent?.toLowerCase().includes('soumettre') || button.textContent?.toLowerCase().includes('complete'))) {
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
      const container = document.querySelector('.jbpm-form-content') as HTMLElement;
      const formElement = container ? (container.querySelector('form') as HTMLFormElement) : null;
      if (formElement) {
        const data: any = {};
        const elements = formElement.querySelectorAll('input, select, textarea');
        elements.forEach((el: any) => {
          if (!el.name) return;
          if (el.type === 'checkbox') {
            data[el.name] = !!el.checked;
          } else if (el.type === 'radio') {
            if (el.checked) data[el.name] = el.value;
          } else {
            data[el.name] = el.value ?? '';
          }
        });
        
        console.log('Données du formulaire HTML à soumettre:', data);
        
        await this.taskService.completeTaskWithClaimIfNecessary(this.taskId, this.containerId, data);
        this.completed.emit();
        console.log('Tâche complétée avec succès');
      } else {
        // Si pas de formulaire trouvé, essayer de récupérer les variables d'entrée
        const taskVariables = await this.taskService.getTaskInputVariables(this.taskId, this.containerId);
        if (taskVariables) {
          await this.taskService.completeTaskWithClaimIfNecessary(this.taskId, this.containerId, taskVariables);
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

  // Suppression du gating côté front: on laisse le serveur autoriser/refuser
  // Soumettre puis avancer (déclenche un event global, capté par le parent)
  async submitAndGoNext(): Promise<void> {
    await this.submitHtmlForm();
    const nextEvent = new CustomEvent('taskFormCompleted');
    window.dispatchEvent(nextEvent);
  }
}