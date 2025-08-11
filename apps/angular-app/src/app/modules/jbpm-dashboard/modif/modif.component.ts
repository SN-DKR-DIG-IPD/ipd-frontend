import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ScriptService } from '../../../shared/services/script-service';
import { TasKStatus } from '@jbpm/domain';
import { HttpClient } from '@angular/common/http';
import { UnifiedAuthService } from '../../../core/service/unified-auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modif',
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
})
export class ModifComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('modalForm') modalForm: ElementRef | undefined;
  
  @Input() form = '';
  @Input() closeModal = true;
  @Input() taskInfo: { containerId: string; taskId: number } | null = null;
  @Output() modalShowChange = new EventEmitter<boolean>();
  @Output() onCompleteTask = new EventEmitter();

  constructor(
    private renderer: Renderer2,
    private scriptService: ScriptService,
    private http: HttpClient,
    private unifiedAuthService: UnifiedAuthService
  ) {}

  ngOnInit() {
    // Écoute l'événement de complétion de tâche
    window.addEventListener('taskCompleted', (event: any) => {
      console.log('Tâche complétée, fermeture de la modale');
      this.onclose();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'] && this.form) {
      console.log('🔍 ModifComponent: Formulaire reçu:', this.form.substring(0, 200) + '...');
      console.log('🔍 ModifComponent: taskInfo:', this.taskInfo);
      // Attendre que le DOM soit rendu avant de charger le formulaire
      setTimeout(() => {
        this.loadForm();
      }, 100);
    }
  }

  ngAfterViewInit(): void {
    // Si le formulaire est déjà disponible, le charger après l'initialisation de la vue
    if (this.form && this.modalForm) {
      console.log('🔍 ModifComponent: ngAfterViewInit - Chargement du formulaire');
      this.loadForm();
    }
  }

  /**
   * Charge le formulaire HTML et injecte les fonctions jBPM
   */
  loadForm(): void {
    console.log('🔍 ModifComponent: Début de loadForm()');
    
    // Vérifier que l'élément DOM est disponible
    if (!this.modalForm) {
      console.error('❌ ModifComponent: modalForm ViewChild n\'est pas disponible');
      // Réessayer après un délai
      setTimeout(() => {
        this.loadForm();
      }, 200);
      return;
    }
    
    const modalFormNode = this.modalForm.nativeElement as HTMLElement;
    if (!modalFormNode) {
      console.error('❌ ModifComponent: modalFormNode est null');
      return;
    }

    console.log('🔍 ModifComponent: modalFormNode trouvé:', modalFormNode);
    console.log('🔍 ModifComponent: modalFormNode.innerHTML avant injection:', modalFormNode.innerHTML);

    // Nettoie le contenu existant
    while (modalFormNode.firstChild) {
      modalFormNode.removeChild(modalFormNode.lastChild!);
    }

    // Corrige les URLs dans le HTML du formulaire
    let correctedForm = this.form;
    correctedForm = correctedForm.replace(/https?:\/\/localhost:8080\/kie-server/g, '/jbpm/api');
    correctedForm = correctedForm.replace(/http:\/\/localhost:8080\/kie-server/g, '/jbpm/api');
    correctedForm = correctedForm.replace(/(src|href|action)=(['"])https?:\/\/localhost:8080\/kie-server/g, '$1=$2/jbpm/api');
    correctedForm = correctedForm.replace(/(src|href|action)=(['"])http:\/\/localhost:8080\/kie-server/g, '$1=$2/jbpm/api');

    console.log('🔍 ModifComponent: HTML corrigé:', correctedForm.substring(0, 300) + '...');

    // Injecte le HTML corrigé
    modalFormNode.insertAdjacentHTML('beforeend', correctedForm);

    console.log('🔍 ModifComponent: HTML injecté, contenu du modalFormNode:', modalFormNode.innerHTML.substring(0, 300) + '...');
    console.log('🔍 ModifComponent: Longueur du contenu injecté:', modalFormNode.innerHTML.length);

    // Injecte immédiatement les fonctions jBPM
    this.injectJbpmFunctions();
  }

  /**
   * Injecte les fonctions jBPM manquantes
   */
  private injectJbpmFunctions(): void {
    const taskInfo = this.taskInfo;
    
    console.log('🔍 ModifComponent - taskInfo:', taskInfo);
    
    if (!taskInfo) {
      console.error('taskInfo est null, impossible d\'injecter les fonctions jBPM');
      return;
    }
    
    if (!taskInfo.containerId || !taskInfo.taskId) {
      console.error('taskInfo incomplet:', { containerId: taskInfo.containerId, taskId: taskInfo.taskId });
      return;
    }

    // Utiliser l'approche alternative directement pour éviter les erreurs de syntaxe
    console.log('🔧 Utilisation de l\'approche alternative pour éviter les erreurs de syntaxe');
    this.injectJbpmFunctionsAlternative();
    
    // Ajoute le CSS pour les animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      /* Styles pour le formulaire jBPM */
      #modalForm input[type="text"], 
      #modalForm input[type="email"], 
      #modalForm input[type="password"],
      #modalForm textarea,
      #modalForm select {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
        background-color: #ffffff;
        color: #374151;
      }
      
      #modalForm input[type="text"]:focus, 
      #modalForm input[type="email"]:focus, 
      #modalForm input[type="password"]:focus,
      #modalForm textarea:focus,
      #modalForm select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      #modalForm label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #374151;
        font-size: 14px;
      }
      
      #modalForm .form-group {
        margin-bottom: 20px;
      }
      
      #modalForm button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      
      #modalForm button[onclick*="claimTask"] {
        background-color: #3b82f6;
        color: white;
      }
      
      #modalForm button[onclick*="claimTask"]:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      
      #modalForm button[onclick*="startTask"] {
        background-color: #10b981;
        color: white;
      }
      
      #modalForm button[onclick*="startTask"]:hover {
        background-color: #059669;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      #modalForm button[onclick*="completeTask"] {
        background-color: #f59e0b;
        color: white;
      }
      
      #modalForm button[onclick*="completeTask"]:hover {
        background-color: #d97706;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      }
      
      #modalForm button[onclick*="saveTask"] {
        background-color: #6b7280;
        color: white;
      }
      
      #modalForm button[onclick*="saveTask"]:hover {
        background-color: #4b5563;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
      }
      
      #modalForm button[onclick*="releaseTask"] {
        background-color: #ef4444;
        color: white;
      }
      
      #modalForm button[onclick*="releaseTask"]:hover {
        background-color: #dc2626;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      
      #modalForm button[onclick*="stopTask"] {
        background-color: #8b5cf6;
        color: white;
      }
      
      #modalForm button[onclick*="stopTask"]:hover {
        background-color: #7c3aed;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
      }
      
      /* Styles pour les sections du formulaire */
      #modalForm .form-section {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      
      #modalForm .form-section h3 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #1f2937;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 8px;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        #modalForm button {
          width: 100%;
          margin-right: 0;
        }
      }
    `;
    document.head.appendChild(style);


  }

  /**
   * Méthode alternative d'injection des fonctions jBPM
   */
  private injectJbpmFunctionsAlternative(): void {
    const taskInfo = this.taskInfo;
    
    if (!taskInfo) {
      console.error('taskInfo est null, impossible d\'injecter les fonctions jBPM');
      return;
    }

    // ✅ REMPLACÉ: XMLHttpRequest par HttpClient
    const makeRequest = async (url: string, method: string, data?: any) => {
      try {
        const authHeaders = this.unifiedAuthService.getAuthHeaders();
        
        if (method === 'PUT') {
          if (data) {
            return await this.http.put(url, data, { headers: authHeaders }).toPromise();
          } else {
            return await this.http.put(url, {}, { headers: authHeaders }).toPromise();
          }
        } else if (method === 'POST') {
          return await this.http.post(url, data, { headers: authHeaders }).toPromise();
        } else if (method === 'GET') {
          return await this.http.get(url, { headers: authHeaders }).toPromise();
        } else {
          throw new Error(`Méthode HTTP non supportée: ${method}`);
        }
      } catch (error) {
        throw new Error('Erreur réseau: ' + error);
      }
    };

    // Fonction pour récupérer les données du formulaire
    const getFormData = () => {
      const formData: any = {};
      const inputs = document.querySelectorAll('input, select, textarea');
      
      inputs.forEach((input: any) => {
        if (input.name && input.value !== undefined) {
          formData[input.name] = input.value;
        }
      });
      
      return formData;
    };

    // Fonction pour afficher une notification
    const showNotification = (message: string, type: string = 'info') => {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      `;
      
      if (type === 'success') {
        notification.style.backgroundColor = '#10B981';
      } else if (type === 'error') {
        notification.style.backgroundColor = '#EF4444';
      } else {
        notification.style.backgroundColor = '#3B82F6';
      }
      
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    };

    // Définit les fonctions globales
    (window as any).claimTask = () => {
      const url = `${environment.bpmAPIBaseUrl}server/containers/${taskInfo.containerId}/tasks/${taskInfo.taskId}/states/claimed`;
      
      makeRequest(url, 'PUT')
        .then(() => {
          showNotification('Tâche réclamée avec succès !', 'success');
        })
        .catch((error: any) => {
          showNotification('Erreur lors de la réclamation: ' + error.message, 'error');
        });
    };

    (window as any).releaseTask = () => {
      const url = `${environment.bpmAPIBaseUrl}server/containers/${taskInfo.containerId}/tasks/${taskInfo.taskId}/states/released`;
      
      makeRequest(url, 'PUT')
        .then(() => {
          showNotification('Tâche libérée avec succès !', 'success');
        })
        .catch((error: any) => {
          showNotification('Erreur lors de la libération: ' + error.message, 'error');
        });
    };

    (window as any).startTask = () => {
      const url = `${environment.bpmAPIBaseUrl}server/containers/${taskInfo.containerId}/tasks/${taskInfo.taskId}/states/started`;
      
      makeRequest(url, 'PUT')
        .then(() => {
          showNotification('Tâche démarrée avec succès !', 'success');
        })
        .catch((error: any) => {
          showNotification('Erreur lors du démarrage: ' + error.message, 'error');
        });
    };

    (window as any).stopTask = () => {
      const url = `${environment.bpmAPIBaseUrl}server/containers/${taskInfo.containerId}/tasks/${taskInfo.taskId}/states/stopped`;
      
      makeRequest(url, 'PUT')
        .then(() => {
          showNotification('Tâche arrêtée avec succès !', 'success');
        })
        .catch((error: any) => {
          showNotification('Erreur lors de l\'arrêt: ' + error.message, 'error');
        });
    };

    (window as any).saveTask = () => {
      const formData = getFormData();
      const url = `${environment.bpmAPIBaseUrl}server/containers/${taskInfo.containerId}/tasks/${taskInfo.taskId}/contents/output`;
      
      makeRequest(url, 'PUT', formData)
        .then(() => {
          showNotification('Formulaire sauvegardé avec succès !', 'success');
        })
        .catch((error: any) => {
          showNotification('Erreur lors de la sauvegarde: ' + error.message, 'error');
        });
    };

    (window as any).completeTask = () => {
      const formData = getFormData();
      const url = `${environment.bpmAPIBaseUrl}server/containers/${taskInfo.containerId}/tasks/${taskInfo.taskId}/states/completed`;
      
      makeRequest(url, 'PUT', formData)
        .then(() => {
          showNotification('Tâche complétée avec succès !', 'success');
          setTimeout(() => {
            const event = new CustomEvent('taskCompleted', { detail: taskInfo });
            window.dispatchEvent(event);
          }, 1000);
        })
        .catch((error: any) => {
          showNotification('Erreur lors de la complétion: ' + error.message, 'error');
        });
    };

    console.log('Fonctions jBPM injectées avec succès dans window global (approche alternative)');
  }

  /**
   * Ferme la modale
   */
  onclose(): void {
    this.closeModal = true;
    this.modalShowChange.emit(this.closeModal);
  }


}


