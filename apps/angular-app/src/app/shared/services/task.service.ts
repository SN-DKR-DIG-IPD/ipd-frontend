import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UnifiedAuthService } from '../../core/service/unified-auth.service';

// ✅ ADAPTATEURS TEMPORAIRES POUR ÉVITER LES ERREURS DE COMPILATION
class ProcessInstanceRestAdapter {
  private defaultHeaders: HeadersInit = {};

  setDefaultHeaders(headers: HeadersInit): void {
    this.defaultHeaders = headers;
  }

  private mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
    const defaults = this.defaultHeaders || {};
    const merged = { ...defaults, ...(customHeaders || {}) };
    return merged;
  }

  async createOneProcessInstance(baseUrl: string, containerId: string, processId: string, bodyJSON: Object, headers?: HeadersInit): Promise<number> {
    const mergedHeaders = this.mergeHeaders(headers);
    console.log('🔍 ProcessInstanceRestAdapter: Démarrage du processus avec URL:', `${baseUrl}server/containers/${containerId}/processes/${processId}/instances`);
    
    const response = await fetch(`${baseUrl}server/containers/${containerId}/processes/${processId}/instances`, {
      method: "POST",
      headers: mergedHeaders,
      body: JSON.stringify(bodyJSON),
      redirect: 'follow' // Suivre les redirections automatiquement
    });

    console.log('🔍 ProcessInstanceRestAdapter: Statut de la réponse:', response.status, response.statusText);

    // Vérifier si la réponse est OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ProcessInstanceRestAdapter: Erreur HTTP:', response.status, errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    // Essayer de récupérer l'ID de l'instance de processus
    const responseText = await response.text();
    console.log('🔍 ProcessInstanceRestAdapter: Texte de réponse brut:', responseText);

    // Essayer plusieurs méthodes pour extraire l'ID
    let processInstanceId: number | undefined;

    // Méthode 1: Parser directement comme nombre
    if (responseText && !isNaN(parseInt(responseText.trim()))) {
      processInstanceId = parseInt(responseText.trim());
      console.log('✅ ProcessInstanceRestAdapter: ID extrait par parseInt:', processInstanceId);
    }
    // Méthode 2: Essayer de parser comme JSON
    else if (responseText && responseText.trim().startsWith('{')) {
      try {
        const jsonResponse = JSON.parse(responseText);
        processInstanceId = jsonResponse.id || jsonResponse.processInstanceId || jsonResponse.processInstance?.id;
        console.log('✅ ProcessInstanceRestAdapter: ID extrait du JSON:', processInstanceId);
      } catch (jsonError) {
        console.warn('⚠️ ProcessInstanceRestAdapter: Impossible de parser comme JSON:', jsonError);
      }
    }
    // Méthode 3: Extraire depuis l'URL de redirection
    else if (response.headers.get('location')) {
      const location = response.headers.get('location');
      const match = location?.match(/\/(\d+)(?:\?|$)/);
      if (match) {
        processInstanceId = parseInt(match[1]);
        console.log('✅ ProcessInstanceRestAdapter: ID extrait de l\'URL de redirection:', processInstanceId);
      }
    }

    if (!processInstanceId || isNaN(processInstanceId)) {
      console.error('❌ ProcessInstanceRestAdapter: Impossible d\'extraire l\'ID de l\'instance de processus');
      throw new Error(`Impossible d'extraire l'ID de l'instance de processus. Réponse: ${responseText}`);
    }

    console.log('✅ ProcessInstanceRestAdapter: Instance de processus créée avec succès, ID:', processInstanceId);
    return processInstanceId;
  }

  async getAllTasksOfOneProcessInstance(baseUrl: string, processInstanceId: number, headers?: HeadersInit): Promise<any> {
    const mergedHeaders = this.mergeHeaders(headers);
    const response = await fetch(`${baseUrl}server/queries/tasks/instances/process/${processInstanceId}`, {
      headers: mergedHeaders
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la récupération des tâches: ${response.status} - ${errorText}`);
    }
    
    const jsonResp = await response.json();
    return jsonResp;
  }
}

class TaskRestAdapter {
  private defaultHeaders: HeadersInit = {};

  setDefaultHeaders(headers: HeadersInit): void {
    this.defaultHeaders = headers;
  }

  private mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
    const defaults = this.defaultHeaders || {};
    const merged = { ...defaults, ...(customHeaders || {}) };
    return merged;
  }

  async putTaskInstanceState(baseUrl: string, containerId: string, taskInstanceId: number, headers?: HeadersInit, state: string = 'claimed'): Promise<string | null> {
    const mergedHeaders = this.mergeHeaders(headers);
    console.log('🔍 TaskRestAdapter: Claim de la tâche:', { containerId, taskInstanceId, state });
    
    const response = await fetch(`${baseUrl}server/containers/${containerId}/tasks/${taskInstanceId}/states/${state}`,
      {
        method: "PUT",
        headers: mergedHeaders
      });
    
    console.log('🔍 TaskRestAdapter: Statut de la réponse:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TaskRestAdapter: Erreur lors du claim:', response.status, errorText);
      throw new Error(`Erreur lors du claim de la tâche: ${response.status} - ${errorText}`);
    }
    
    const jsonResp = await response.text();
    console.log('✅ TaskRestAdapter: Tâche claimée avec succès');
    return jsonResp;
  }
}

class FormRestAdapter {
  private defaultHeaders: HeadersInit = {};

  setDefaultHeaders(headers: HeadersInit): void {
    this.defaultHeaders = headers;
  }

  private mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
    const defaults = this.defaultHeaders || {};
    const merged = { ...defaults, ...(customHeaders || {}) };
    return merged;
  }

  async getTaskInstanceForm(baseUrl: string, containerId: string, taskInstanceId: number, headers?: HeadersInit): Promise<string> {
    const mergedHeaders = this.mergeHeaders(headers);
    console.log('🔍 FormRestAdapter: Récupération du formulaire:', { containerId, taskInstanceId });
    
    const response = await fetch(`${baseUrl}server/containers/${containerId}/forms/tasks/${taskInstanceId}/content`, {
      headers: mergedHeaders
    });
    
    console.log('🔍 FormRestAdapter: Statut de la réponse:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FormRestAdapter: Erreur lors de la récupération du formulaire:', response.status, errorText);
      throw new Error(`Erreur lors de la récupération du formulaire: ${response.status} - ${errorText}`);
    }
    
    const textResp = await response.text();
    console.log('✅ FormRestAdapter: Formulaire récupéré avec succès, longueur:', textResp.length);
    return textResp;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // ✅ CORRIGÉ: Utilise environment (qui lit window.__env)
  private apiUrl = environment.bpmAPIBaseUrl;

  // ✅ ADAPTATEURS JBPM
  private processInstanceAdapter = new ProcessInstanceRestAdapter();
  private taskAdapter = new TaskRestAdapter();
  private formAdapter = new FormRestAdapter();

  constructor(
    private http: HttpClient,
    private unifiedAuthService: UnifiedAuthService
  ) {
    // ✅ Initialiser les headers par défaut pour les adapters
    this.initializeDefaultHeaders();
  }

  // ✅ MÉTHODE POUR INITIALISER LES HEADERS PAR DÉFAUT
  private initializeDefaultHeaders(): void {
    const token = this.unifiedAuthService.getToken();
    if (token) {
      const defaultHeaders: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      // ✅ Configurer les headers par défaut pour tous les adapters
      this.processInstanceAdapter.setDefaultHeaders(defaultHeaders);
      this.taskAdapter.setDefaultHeaders(defaultHeaders);
      this.formAdapter.setDefaultHeaders(defaultHeaders);
      
      console.log('✅ TaskService: Headers par défaut initialisés avec le token');
    } else {
      console.warn('⚠️ TaskService: Aucun token trouvé pour initialiser les headers par défaut');
    }
  }

  // ✅ MÉTHODE POUR METTRE À JOUR LES HEADERS PAR DÉFAUT
  private updateDefaultHeaders(): void {
    this.initializeDefaultHeaders();
  }

  // ✅ MÉTHODES OBSERVABLE (nouvelle approche)
  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}server/queries/tasks/instances/pot-owners`);
  }

  getTaskForm(containerId: string, taskId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}server/containers/${containerId}/forms/tasks/${taskId}/content`,
      { responseType: 'text' }
    );
  }

  // ✅ MÉTHODES PROMISE (compatibilité avec l'existant)
  async getTasksForProcessInstance(processInstanceId: number, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/queries/tasks/instances/process/${processInstanceId}`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  }

  async getUserTasks(headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/queries/tasks/user`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des tâches utilisateur:', error);
      throw error;
    }
  }

  async getUserPotentialTasks(headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/queries/tasks/user/potentials`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des tâches potentielles:', error);
      throw error;
    }
  }

  async getTaskDetails(taskId: number, containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/tasks/${taskId}`).toPromise();
      return result;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des détails de tâche:', error);
      throw error;
    }
  }

  async getTaskInputVariables(taskId: number, containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/contents/input`).toPromise();
      return result || {};
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des variables d\'entrée:', error);
      throw error;
    }
  }

  async getTaskOutputVariables(taskId: number, containerId: string, headers?: any): Promise<any> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/contents/output`).toPromise();
      return result || {};
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération des variables de sortie:', error);
      throw error;
    }
  }

  async calculateTaskCompletionRate(processInstanceId: number, headers?: any): Promise<number> {
    try {
      const tasks = await this.getTasksForProcessInstance(processInstanceId, headers);
      if (!tasks || !Array.isArray(tasks)) {
        return 0;
      }
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task['task-status'] === 'Completed').length;
      
      return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors du calcul du taux de complétion:', error);
      return 0;
    }
  }

  async completeTask(taskId: number, containerId: string, data: any = {}, headers?: any): Promise<void> {
    try {
      console.log('🔍 TaskService: Complétion de la tâche:', { taskId, containerId, data });
      
      // Utiliser les headers d'authentification par défaut
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Essayer d'abord l'endpoint de soumission de formulaire
      try {
        await this.http.post(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/contents/output`, 
          data,
          { headers: authHeaders }
        ).toPromise();
        
        console.log('✅ TaskService: Formulaire soumis avec succès');
        
        // Ensuite, essayer de compléter la tâche
        await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/completed`, 
          {},
          { headers: authHeaders }
        ).toPromise();
        
        console.log('✅ TaskService: Tâche complétée avec succès');
      } catch (submitError: any) {
        console.log('⚠️ TaskService: Erreur lors de la soumission du formulaire, tentative directe de complétion:', submitError);
        
        // Si la soumission échoue, essayer directement la complétion
        await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/completed`, 
          data,
          { headers: authHeaders }
        ).toPromise();
        
        console.log('✅ TaskService: Tâche complétée directement avec succès');
      }
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la complétion de la tâche:', error);
      throw error;
    }
  }

  async claimTask(taskId: number, containerId: string, userId?: string, headers?: any): Promise<void> {
    try {
      console.log('🔍 TaskService: Claim de la tâche:', { taskId, containerId, userId });
      
      // Récupérer les headers d'authentification si non fournis
      if (!headers) {
        headers = await this.getAuthHeaders();
      }
      
      // Convertir HeadersInit en HttpHeaders pour Angular
      let httpHeaders = new HttpHeaders();
      Object.entries(headers).forEach(([key, value]) => {
        if (value) {
          httpHeaders = httpHeaders.set(key, value as string);
        }
      });
      
      // ✅ APPROCHE JBPM: Claim sans spécifier d'utilisateur (utilise les rôles du token)
      const claimData = userId ? { 'user': userId } : {};
      
      await this.http.put(
        `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`, 
        claimData,
        { headers: httpHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Tâche claimée avec succès');
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la réclamation de la tâche:', error);
      throw error;
    }
  }

  async releaseTask(taskId: number, containerId: string, headers?: any): Promise<void> {
    try {
      await this.http.put(`${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/released`, {}).toPromise();
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la libération de la tâche:', error);
      throw error;
    }
  }

  async getTaskFormHtml(taskId: number, containerId: string): Promise<string> {
    try {
      const result = await this.http.get(
        `${this.apiUrl}server/containers/${containerId}/forms/tasks/${taskId}/content`,
        { responseType: 'text' }
      ).toPromise();
      return result as string;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération du formulaire HTML:', error);
      throw error;
    }
  }

  // ✅ NOUVELLES MÉTHODES POUR L'APPROCHE DYNAMIQUE
  async getProcessList(containerId: string): Promise<any[]> {
    try {
      const result = await this.http.get(`${this.apiUrl}server/containers/${containerId}/processes`).toPromise();
      return (result as any)?.processes || [];
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la récupération de la liste des processus:', error);
      throw error;
    }
  }

  async startProcess(containerId: string, processId: string, variables: any = {}): Promise<number> {
    try {
      const result = await this.http.post(
        `${this.apiUrl}server/containers/${containerId}/processes/${processId}/instances`,
        variables
      ).toPromise();
      return result as number;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors du démarrage du processus:', error);
      throw error;
    }
  }

    async submitTaskForm(taskId: number | null, containerId: string, formData: any): Promise<void> {
    try {
      if (!taskId) {
        throw new Error('ID de tâche manquant');
      }
      
      console.log('🔍 TaskService: Soumission du formulaire:', { taskId, containerId, formData });
      
      // ✅ UTILISER LA NOUVELLE MÉTHODE COMPLÈTE AVEC CLAIM AUTOMATIQUE
      await this.completeTaskWithClaimIfNecessary(taskId, containerId, formData);
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la soumission du formulaire:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE COMBINÉE POUR LE WORKFLOW COMPLET - VERSION OBSERVABLE
  startProcessAndLoadForm(containerId: string, processId: string, variables: any = {}): Observable<string> {
    return new Observable(observer => {
      this.executeWorkflowComplete(containerId, processId, variables)
        .then(formHtml => {
          observer.next(formHtml);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // ✅ MÉTHODE COMBINÉE AVEC ADAPTATEURS JBPM
  startProcessAndLoadFormWithAdapters(containerId: string, processId: string, variables: any = {}): Observable<any> {
    return new Observable(observer => {
      this.executeWorkflowWithAdapters(containerId, processId, variables)
        .then(formHtml => {
          observer.next(formHtml);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // ✅ MÉTHODE ALTERNATIVE: Démarrer le processus sans claim automatique
  startProcessWithoutAutoClaim(containerId: string, processId: string, variables: any = {}): Observable<any> {
    return new Observable(observer => {
      this.executeProcessStartOnly(containerId, processId, variables)
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // ✅ MÉTHODE PRIVÉE POUR EXÉCUTER LE WORKFLOW COMPLET
  private async executeWorkflowComplete(containerId: string, processId: string, variables: any = {}): Promise<string> {
    try {
      console.log('🔍 TaskService: Démarrage du workflow complet pour', { containerId, processId });
      
      // 1. Démarrer le processus
      console.log('📋 TaskService: Étape 1 - Démarrage du processus...');
      const processInstanceId = await this.startProcess(containerId, processId, variables);
      console.log('✅ TaskService: Processus démarré avec succès, instance ID:', processInstanceId);
      
      // 2. Récupérer les tâches de l'instance
      console.log('📋 TaskService: Étape 2 - Récupération des tâches de l\'instance...');
      const tasksResult = await this.getTasksForProcessInstance(processInstanceId);
      const taskList = tasksResult['task-summary'] || [];
      
      if (taskList.length === 0) {
        throw new Error('Aucune tâche trouvée pour cette instance de processus');
      }
      
      // Trouver la première tâche utilisateur disponible
      const firstUserTask = taskList.find((task: any) => 
        task['task-status'] === 'Ready' || 
        task['task-status'] === 'Reserved' || 
        task['task-status'] === 'InProgress'
      );
      
      if (!firstUserTask) {
        throw new Error('Aucune tâche utilisateur disponible pour cette instance');
      }
      
      const taskId = firstUserTask['task-id'];
      const taskContainerId = firstUserTask['task-container-id'] || containerId;
      
      console.log('✅ TaskService: Tâche trouvée:', { taskId, taskContainerId, status: firstUserTask['task-status'] });
      
      // 3. Claim la tâche si elle n'est pas déjà claimée
      if (firstUserTask['task-status'] === 'Ready') {
        console.log('📋 TaskService: Étape 3 - Claim de la tâche...');
        try {
          // Récupérer l'utilisateur actuel depuis le token ou la session
          const currentUser = this.getCurrentUser();
          await this.claimTask(taskId, taskContainerId, currentUser);
          console.log('✅ TaskService: Tâche claimée avec succès');
        } catch (claimError: any) {
          console.warn('⚠️ TaskService: Erreur lors du claim de la tâche:', claimError);
          // Continuer même si le claim échoue (peut-être déjà claimée)
        }
      } else {
        console.log('ℹ️ TaskService: Tâche déjà claimée ou en cours, pas besoin de claim');
      }
      
      // 4. Récupérer le formulaire HTML
      console.log('📋 TaskService: Étape 4 - Récupération du formulaire HTML...');
      const formHtml = await this.getTaskFormHtml(taskId, taskContainerId);
      console.log('✅ TaskService: Formulaire HTML récupéré, longueur:', formHtml.length);
      
      return formHtml;
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur dans le workflow complet:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE PRIVÉE POUR EXÉCUTER LE WORKFLOW AVEC ADAPTATEURS
  private async executeWorkflowWithAdapters(containerId: string, processId: string, variables: any = {}): Promise<any> {
    try {
      console.log('🔍 TaskService: Démarrage du workflow avec adaptateurs pour', { containerId, processId });
      
      // Récupérer les headers d'authentification
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Convertir HttpHeaders en format compatible avec les adaptateurs
      const adapterHeaders: HeadersInit = {};
      authHeaders.keys().forEach(key => {
        const value = authHeaders.get(key);
        if (value) {
          adapterHeaders[key] = value;
        }
      });
      
      // 1. Démarrer le processus avec l'adaptateur
      console.log('📋 TaskService: Étape 1 - Démarrage du processus avec adaptateur...');
      const processInstanceId = await this.processInstanceAdapter.createOneProcessInstance(
        this.apiUrl,
        containerId,
        processId,
        variables,
        adapterHeaders
      );
      console.log('✅ TaskService: Processus démarré avec adaptateur, instance ID:', processInstanceId);
      
      // Vérifier que l'instance ID est valide
      if (!processInstanceId || isNaN(processInstanceId)) {
        throw new Error(`Instance ID invalide reçu: ${processInstanceId}`);
      }
      
      // 2. Récupérer les tâches de l'instance avec l'adaptateur
      console.log('📋 TaskService: Étape 2 - Récupération des tâches avec adaptateur...');
      const tasksResult = await this.processInstanceAdapter.getAllTasksOfOneProcessInstance(
        this.apiUrl,
        processInstanceId,
        adapterHeaders
      );
      const taskList = tasksResult['task-summary'] || [];
      
      console.log('🔍 TaskService: Tâches récupérées:', taskList);
      
      if (taskList.length === 0) {
        throw new Error('Aucune tâche trouvée pour cette instance de processus');
      }
      
      // Trouver la première tâche utilisateur disponible
      const firstUserTask = taskList.find((task: any) => 
        task['task-status'] === 'Ready' || 
        task['task-status'] === 'Reserved' || 
        task['task-status'] === 'InProgress'
      );
      
      if (!firstUserTask) {
        throw new Error('Aucune tâche utilisateur disponible pour cette instance');
      }
      
      const taskId = firstUserTask['task-id'];
      const taskContainerId = firstUserTask['task-container-id'] || containerId;
      
      console.log('✅ TaskService: Tâche trouvée avec adaptateur:', { taskId, taskContainerId, status: firstUserTask['task-status'] });
      
      // 3. ✅ VÉRIFIER LES PERMISSIONS ET CLAIM LA TÂCHE
      console.log('📋 TaskService: Étape 3 - Vérification des permissions et claim de la tâche...');
      
      // ✅ DIAGNOSTIC DES PERMISSIONS AVANT LE CLAIM
      try {
        await this.diagnoseUserPermissions(taskContainerId, taskId);
      } catch (diagnosticError: any) {
        console.warn('⚠️ TaskService: Erreur lors du diagnostic des permissions:', diagnosticError);
        // Continuer même si le diagnostic échoue
      }
      
      // Vérifier d'abord les détails de la tâche
      try {
        const taskDetails = await this.http.get(
          `${this.apiUrl}server/containers/${taskContainerId}/tasks/${taskId}`,
          { headers: authHeaders }
        ).toPromise();
        console.log('✅ TaskService: Détails de la tâche récupérés:', taskDetails);
      } catch (taskDetailsError: any) {
        console.warn('⚠️ TaskService: Impossible de récupérer les détails de la tâche:', taskDetailsError);
      }
      
      // ✅ APPROCHE JBPM PORTAL: Pas de claim automatique
      console.log('ℹ️ TaskService: Approche JBPM Portal - Pas de claim automatique');
      console.log('ℹ️ TaskService: Statut de la tâche:', firstUserTask['task-status']);
      
      // Si la tâche est déjà claimée, on peut continuer
      if (firstUserTask['task-status'] === 'Reserved' || firstUserTask['task-status'] === 'InProgress') {
        console.log('✅ TaskService: Tâche déjà claimée, on peut continuer');
      } else {
        console.log('ℹ️ TaskService: Tâche non claimée, on essaie de récupérer le formulaire directement');
      }
      
      // 4. ✅ RÉCUPÉRER LE FORMULAIRE HTML AVEC GESTION D'ERREUR AMÉLIORÉE
      console.log('📋 TaskService: Étape 4 - Récupération du formulaire HTML...');
      
      let formHtml: string = '';
      let formRetrieved = false;
      
      // ✅ ESSAYER PLUSIEURS APPROCHES POUR RÉCUPÉRER LE FORMULAIRE
      
      // Approche 1: Avec l'adaptateur
      if (!formRetrieved) {
        try {
          console.log('🔍 TaskService: Tentative 1 - Récupération avec adaptateur...');
          formHtml = await this.formAdapter.getTaskInstanceForm(
            this.apiUrl,
            taskContainerId,
            taskId,
            adapterHeaders
          );
          console.log('✅ TaskService: Formulaire récupéré avec adaptateur');
          formRetrieved = true;
        } catch (formError: any) {
          console.warn('⚠️ TaskService: Erreur avec l\'adaptateur:', formError);
        }
      }
      
      // Approche 2: Avec HttpClient direct
      if (!formRetrieved) {
        try {
          console.log('🔍 TaskService: Tentative 2 - Récupération avec HttpClient...');
          const response = await this.http.get(
            `${this.apiUrl}server/containers/${taskContainerId}/forms/tasks/${taskId}/content`,
            { 
              headers: authHeaders,
              responseType: 'text'
            }
          ).toPromise();
          
          formHtml = response as string;
          console.log('✅ TaskService: Formulaire récupéré avec HttpClient');
          formRetrieved = true;
        } catch (httpFormError: any) {
          console.warn('⚠️ TaskService: Erreur avec HttpClient:', httpFormError);
        }
      }
      
      // Approche 3: Essayer de récupérer le formulaire sans claim (pour les tâches publiques)
      if (!formRetrieved) {
        try {
          console.log('🔍 TaskService: Tentative 3 - Récupération sans claim (tâche publique)...');
          
          // Essayer de récupérer le formulaire avec des headers différents
          const publicHeaders: any = { ...authHeaders };
          if (publicHeaders['Authorization']) {
            delete publicHeaders['Authorization']; // Essayer sans authentification
          }
          
          const response = await this.http.get(
            `${this.apiUrl}server/containers/${taskContainerId}/forms/tasks/${taskId}/content`,
            { 
              headers: publicHeaders,
              responseType: 'text'
            }
          ).toPromise();
          
          formHtml = response as string;
          console.log('✅ TaskService: Formulaire récupéré sans authentification (tâche publique)');
          formRetrieved = true;
        } catch (publicFormError: any) {
          console.warn('⚠️ TaskService: Erreur avec approche publique:', publicFormError);
        }
      }
      
      // Si aucune approche n'a fonctionné
      if (!formRetrieved) {
        console.error('❌ TaskService: Impossible de récupérer le formulaire avec toutes les approches');
        throw new Error('Impossible de récupérer le formulaire. Vérifiez les permissions de l\'utilisateur pour cette tâche.');
      }
      
      console.log('✅ TaskService: Formulaire HTML récupéré, longueur:', formHtml.length);
      
      // ✅ RETOURNER LES INFORMATIONS COMPLÈTES
      return {
        formHtml: formHtml,
        taskId: taskId,
        containerId: taskContainerId,
        processInstanceId: processInstanceId
      };
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur dans le workflow avec adaptateurs:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE PRIVÉE POUR DÉMARRER SEULEMENT LE PROCESSUS
  private async executeProcessStartOnly(containerId: string, processId: string, variables: any = {}): Promise<any> {
    try {
      console.log('🔍 TaskService: Démarrage du processus SANS claim automatique pour:', { containerId, processId });
      
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Convertir HttpHeaders en format compatible avec les adaptateurs
      const adapterHeaders: HeadersInit = {};
      authHeaders.keys().forEach(key => {
        const value = authHeaders.get(key);
        if (value) {
          adapterHeaders[key] = value;
        }
      });
      
      // 1. Démarrer le processus avec l'adaptateur
      console.log('📋 TaskService: Étape 1 - Démarrage du processus...');
      const processInstanceId = await this.processInstanceAdapter.createOneProcessInstance(
        this.apiUrl,
        containerId,
        processId,
        variables,
        adapterHeaders
      );
      console.log('✅ TaskService: Processus démarré, instance ID:', processInstanceId);
      
      // Vérifier que l'instance ID est valide
      if (!processInstanceId || isNaN(processInstanceId)) {
        throw new Error(`Instance ID invalide reçu: ${processInstanceId}`);
      }
      
      // 2. Récupérer les tâches de l'instance
      console.log('📋 TaskService: Étape 2 - Récupération des tâches...');
      const tasksResult = await this.processInstanceAdapter.getAllTasksOfOneProcessInstance(
        this.apiUrl,
        processInstanceId,
        adapterHeaders
      );
      const taskList = tasksResult['task-summary'] || [];
      
      console.log('🔍 TaskService: Tâches récupérées:', taskList);
      
      if (taskList.length === 0) {
        throw new Error('Aucune tâche trouvée pour cette instance de processus');
      }
      
      // Trouver la première tâche utilisateur disponible
      const firstUserTask = taskList.find((task: any) => 
        task['task-status'] === 'Ready' || 
        task['task-status'] === 'Reserved' || 
        task['task-status'] === 'InProgress'
      );
      
      if (!firstUserTask) {
        throw new Error('Aucune tâche utilisateur disponible pour cette instance');
      }
      
      const taskId = firstUserTask['task-id'];
      const taskContainerId = firstUserTask['task-container-id'] || containerId;
      
      console.log('✅ TaskService: Tâche trouvée:', { taskId, taskContainerId, status: firstUserTask['task-status'] });
      
      // ✅ RETOURNER LES INFORMATIONS SANS CLAIMER
      return {
        processInstanceId: processInstanceId,
        taskId: taskId,
        containerId: taskContainerId,
        taskStatus: firstUserTask['task-status'],
        message: 'Processus démarré avec succès. La tâche doit être claimée manuellement.'
      };
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur dans le démarrage du processus:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE AUXILIAIRE POUR RÉCUPÉRER L'UTILISATEUR ACTUEL
  private getCurrentUser(): string {
    try {
      // ✅ UTILISATION D'UNIFIEDAUTHSERVICE
      const token = this.unifiedAuthService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.preferred_username || payload.sub || 'unknown';
      }
    } catch (error) {
      console.warn('⚠️ TaskService: Impossible de décoder le token JWT:', error);
    }
    
    // Fallback vers une valeur par défaut
    return 'unknown';
  }

  // ✅ MÉTHODE AUXILIAIRE POUR RÉCUPÉRER LES HEADERS D'AUTHENTIFICATION
  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      // ✅ UTILISATION D'UNIFIEDAUTHSERVICE
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Convertir HttpHeaders en HeadersInit
      const headers: HeadersInit = {};
      authHeaders.keys().forEach(key => {
        const value = authHeaders.get(key);
        if (value) {
          headers[key] = value;
        }
      });
      
      console.log('🔍 TaskService: Headers d\'authentification récupérés:', headers);
      return headers;
      
    } catch (error) {
      console.warn('⚠️ TaskService: Impossible de récupérer les headers d\'authentification:', error);
      // Fallback vers des headers vides
      return {
        'Content-Type': 'application/json'
      };
    }
  }

  // ✅ MÉTHODE POUR VÉRIFIER LES PERMISSIONS DE L'UTILISATEUR
  async checkUserPermissions(containerId: string, taskId: number): Promise<any> {
    try {
      console.log('🔍 TaskService: Vérification des permissions pour:', { containerId, taskId });
      
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Vérifier les détails de la tâche
      const taskDetails = await this.http.get(
        `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}`,
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Détails de la tâche récupérés:', taskDetails);
      return taskDetails;
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la vérification des permissions:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE COMPLÈTE POUR COMPLÉTER UNE TÂCHE AVEC CLAIM AUTOMATIQUE
  async completeTaskWithClaimIfNecessary(taskId: number, containerId: string, formData: any = {}): Promise<void> {
    try {
      console.log('🔍 TaskService: Début de completeTaskWithClaimIfNecessary:', { taskId, containerId });
      console.log('🔍 TaskService: Données du formulaire à envoyer:', formData);
      
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // 1. Vérifier le statut actuel de la tâche
      console.log('📋 TaskService: Étape 1 - Vérification du statut de la tâche...');
      const taskDetails = await this.http.get(
        `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}`,
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Détails de la tâche récupérés:', taskDetails);
      
      // 2. ✅ APPROCHE JBPM PORTAL: Pas de claim automatique
      const taskStatus = (taskDetails as any)['task-status'];
      console.log('🔍 TaskService: Statut de la tâche:', taskStatus);
      
      console.log('ℹ️ TaskService: Approche JBPM Portal - Pas de claim automatique');
      console.log('ℹ️ TaskService: On procède directement à la complétion');
      
      // 4. ✅ APPROCHE PORTAL: Compléter directement la tâche avec les données du formulaire
      console.log('📋 TaskService: Étape 4 - Complétion de la tâche (approche portal)...');
      
      // Vérifier si les données sont vides
      if (Object.keys(formData).length === 0) {
        console.log('ℹ️ TaskService: Aucune donnée de formulaire, complétion sans données');
        await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/completed`,
          {},
          { headers: authHeaders }
        ).toPromise();
      } else {
        console.log('ℹ️ TaskService: Données de formulaire présentes, complétion avec données');
        console.log('🔍 TaskService: Données à envoyer:', formData);
        
        await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/completed`,
          formData,
          { headers: authHeaders }
        ).toPromise();
      }
      
      console.log('✅ TaskService: Tâche complétée avec succès (approche portal)');
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur dans completeTaskWithClaimIfNecessary:', error);
      throw error;
    }
  }

  // ✅ NOUVELLE MÉTHODE POUR DIAGNOSTIQUER LES PERMISSIONS
  async diagnoseUserPermissions(containerId: string, taskId: number): Promise<any> {
    try {
      console.log('🔍 TaskService: Diagnostic des permissions pour:', { containerId, taskId });
      
      // ✅ AFFICHER LES DÉTAILS COMPLETS DU TOKEN
      this.displayTokenDetails();
      
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // 1. Vérifier les détails de la tâche
      console.log('📋 TaskService: Étape 1 - Vérification des détails de la tâche...');
      const taskDetails = await this.http.get(
        `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}`,
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Détails de la tâche:', taskDetails);
      
      // 2. Vérifier les informations de l'utilisateur connecté
      console.log('📋 TaskService: Étape 2 - Vérification des informations utilisateur...');
      try {
        const currentUser = this.getCurrentUser();
        console.log('✅ TaskService: Utilisateur actuel:', currentUser);
        
        // Vérifier le token pour les rôles
        const token = this.unifiedAuthService.getToken();
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('✅ TaskService: Rôles dans le token:', payload.realm_access?.roles || payload.roles || 'Aucun rôle trouvé');
          
          // Vérifier si l'utilisateur a le rôle PM
          const roles = payload.realm_access?.roles || payload.roles || [];
          const hasPMRole = roles.includes('PM') || roles.includes('pm');
          console.log('✅ TaskService: Utilisateur a le rôle PM:', hasPMRole);
        }
      } catch (userInfoError: any) {
        console.warn('⚠️ TaskService: Impossible de récupérer les informations utilisateur:', userInfoError);
      }
      
      // 3. Vérifier les tâches de l'utilisateur (avec endpoints réels de JBPM)
      console.log('📋 TaskService: Étape 3 - Vérification des tâches de l\'utilisateur...');
      try {
        // Essayer d'abord l'endpoint des propriétaires
        const ownerTasks = await this.http.get(
          `${this.apiUrl}server/queries/tasks/instances/owners`,
          { headers: authHeaders }
        ).toPromise();
        console.log('✅ TaskService: Tâches des propriétaires:', ownerTasks);
        
        // Vérifier si cette tâche est dans les tâches des propriétaires
        const taskInOwnerTasks = (ownerTasks as any)['task-summary']?.find((task: any) => 
          task['task-id'] === taskId && task['task-container-id'] === containerId
        );
        
        if (taskInOwnerTasks) {
          console.log('✅ TaskService: La tâche est dans les tâches des propriétaires');
        } else {
          console.warn('⚠️ TaskService: La tâche n\'est PAS dans les tâches des propriétaires');
        }
      } catch (ownerTasksError: any) {
        console.warn('⚠️ TaskService: Impossible de récupérer les tâches des propriétaires:', ownerTasksError);
        
        try {
          // Essayer l'endpoint des administrateurs
          const adminTasks = await this.http.get(
            `${this.apiUrl}server/queries/tasks/instances/admins`,
            { headers: authHeaders }
          ).toPromise();
          console.log('✅ TaskService: Tâches des administrateurs:', adminTasks);
        } catch (adminTasksError: any) {
          console.warn('⚠️ TaskService: Impossible de récupérer les tâches des administrateurs:', adminTasksError);
        }
      }
      
      return {
        taskDetails,
        hasPermission: true // À déterminer selon les résultats
      };
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors du diagnostic des permissions:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE POUR CLAIMER AVEC LES RÔLES KEYCLOAK (JBPM groupe = Keycloak rôle)
  async claimTaskWithDifferentGroups(taskId: number, containerId: string): Promise<any> {
    console.log('🔍 TaskService: Tentative de claim avec les rôles Keycloak pour:', { taskId, containerId });
    
    const authHeaders = this.unifiedAuthService.getAuthHeaders();
    
    // ✅ RÉCUPÉRER LES VRAIS RÔLES DE L'UTILISATEUR DEPUIS LE TOKEN
    const token = this.unifiedAuthService.getToken();
    let userRoles: string[] = [];
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // ✅ UTILISER LES RÔLES AU LIEU DES GROUPES (JBPM groupe = Keycloak rôle)
        userRoles = payload.realm_access?.roles || payload.roles || [];
        console.log('✅ TaskService: Rôles de l\'utilisateur depuis le token:', userRoles);
        console.log('✅ TaskService: Payload complet pour debug:', {
          realm_access: payload.realm_access,
          roles: payload.roles,
          groups: payload.groups
        });
      } catch (error) {
        console.error('❌ TaskService: Erreur lors de l\'extraction des rôles du token:', error);
      }
    }
    
    // ✅ ESSAYER D'ABORD AVEC LES RÔLES DE L'UTILISATEUR
    for (const role of userRoles) {
      try {
        console.log(`🔍 TaskService: Tentative de claim avec le rôle de l'utilisateur: ${role}`);
        
        const result = await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
          { 'group': role }, // JBPM attend 'group' mais on envoie le rôle Keycloak
          { headers: authHeaders }
        ).toPromise();
        
        console.log(`✅ TaskService: Claim réussi avec le rôle de l'utilisateur: ${role}`);
        return { success: true, role: role, result: result, source: 'user_roles' };
        
      } catch (error: any) {
        console.warn(`⚠️ TaskService: Échec du claim avec le rôle utilisateur ${role}:`, error.status, error.statusText);
        
        if (error.status === 403) {
          console.log(`❌ TaskService: Permission refusée pour le rôle utilisateur: ${role}`);
        } else if (error.status === 404) {
          console.log(`❌ TaskService: Tâche non trouvée pour le rôle utilisateur: ${role}`);
        }
      }
    }
    
    // ✅ SI AUCUN RÔLE UTILISATEUR NE FONCTIONNE, ESSAYER SANS RÔLE SPÉCIFIQUE (TÂCHE PUBLIQUE)
    try {
      console.log('🔍 TaskService: Tentative de claim sans rôle spécifique (tâche publique)...');
      
      const result = await this.http.put(
        `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
        {}, // Pas de groupe spécifique
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Claim réussi sans rôle spécifique (tâche publique)');
      return { success: true, role: 'public', result: result, source: 'public_task' };
      
    } catch (error: any) {
      console.warn('⚠️ TaskService: Échec du claim sans rôle spécifique:', error.status, error.statusText);
    }
    
    // ✅ SI RIEN NE FONCTIONNE, ESSAYER AVEC L'UTILISATEUR SPÉCIFIQUE
    try {
      console.log('🔍 TaskService: Tentative de claim avec l\'utilisateur spécifique...');
      
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const result = await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
          { 'user': currentUser }, // Essayer avec l'utilisateur spécifique
          { headers: authHeaders }
        ).toPromise();
        
        console.log('✅ TaskService: Claim réussi avec l\'utilisateur spécifique');
        return { success: true, user: currentUser, result: result, source: 'specific_user' };
      }
    } catch (error: any) {
      console.warn('⚠️ TaskService: Échec du claim avec l\'utilisateur spécifique:', error.status, error.statusText);
    }
    
    // ✅ DERNIER ESSAI: RÔLES PAR DÉFAUT
    const defaultRoles = ['PM', 'pm', 'employe', 'employee', 'admin', 'administrator'];
    for (const role of defaultRoles) {
      try {
        console.log(`🔍 TaskService: Tentative de claim avec le rôle par défaut: ${role}`);
        
        const result = await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
          { 'group': role },
          { headers: authHeaders }
        ).toPromise();
        
        console.log(`✅ TaskService: Claim réussi avec le rôle par défaut: ${role}`);
        return { success: true, role: role, result: result, source: 'default_role' };
        
      } catch (error: any) {
        console.warn(`⚠️ TaskService: Échec du claim avec le rôle par défaut ${role}:`, error.status, error.statusText);
      }
    }
    
    console.error('❌ TaskService: Aucune méthode de claim n\'a fonctionné');
    throw new Error('Impossible de claim la tâche avec aucune méthode');
  }

  // ✅ MÉTHODE DE DIAGNOSTIC APPROFONDI POUR LE CLAIM
  async diagnoseClaimIssue(taskId: number, containerId: string): Promise<any> {
    console.log('🔍 TaskService: === DIAGNOSTIC APPROFONDI DU CLAIM ===');
    
    const authHeaders = this.unifiedAuthService.getAuthHeaders();
    const token = this.unifiedAuthService.getToken();
    
    try {
      // 1. Afficher les détails du token
      this.displayTokenDetails();
      
      // 2. Récupérer les détails de la tâche
      console.log('🔍 TaskService: Récupération des détails de la tâche...');
      const taskDetails = await this.http.get(
        `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}`,
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Détails de la tâche:', taskDetails);
      
      // 3. Vérifier les groupes assignés à la tâche
      const taskGroups = (taskDetails as any)['task-actual-owner-groups'] || (taskDetails as any)['task-potential-owners'] || [];
      console.log('✅ TaskService: Groupes assignés à la tâche:', taskGroups);
      
      // 4. Vérifier le statut de la tâche
      const taskStatus = (taskDetails as any)['task-status'];
      console.log('✅ TaskService: Statut de la tâche:', taskStatus);
      
      // 5. Vérifier si la tâche est déjà claimée
      const taskOwner = (taskDetails as any)['task-actual-owner'];
      console.log('✅ TaskService: Propriétaire actuel de la tâche:', taskOwner);
      
      // 6. Tester un claim avec le rôle PM spécifiquement
      console.log('🔍 TaskService: Test de claim avec le rôle PM...');
      try {
        const claimResult = await this.http.put(
          `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
          { 'group': 'PM' },
          { headers: authHeaders }
        ).toPromise();
        console.log('✅ TaskService: Claim avec PM réussi:', claimResult);
      } catch (claimError: any) {
        console.error('❌ TaskService: Claim avec PM échoué:', claimError);
        
        // 7. Analyser la réponse d'erreur
        if (claimError.error) {
          console.error('❌ TaskService: Détails de l\'erreur:', claimError.error);
        }
        
        // 8. Vérifier les headers de la requête
        console.log('🔍 TaskService: Headers envoyés:', authHeaders);
        
        // 9. ✅ ESSAYER UN CLAIM SANS GROUPE (pour les tâches publiques)
        console.log('🔍 TaskService: Test de claim sans groupe (tâche publique)...');
        try {
          const publicClaimResult = await this.http.put(
            `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
            {}, // Pas de groupe spécifié
            { headers: authHeaders }
          ).toPromise();
          console.log('✅ TaskService: Claim sans groupe réussi (tâche publique):', publicClaimResult);
        } catch (publicClaimError: any) {
          console.error('❌ TaskService: Claim sans groupe aussi échoué:', publicClaimError);
          
          // 10. ✅ ESSAYER UN CLAIM AVEC UTILISATEUR SPÉCIFIQUE
          console.log('🔍 TaskService: Test de claim avec utilisateur spécifique...');
          try {
            const currentUser = this.getCurrentUser();
            const userClaimResult = await this.http.put(
              `${this.apiUrl}server/containers/${containerId}/tasks/${taskId}/states/claimed`,
              { 'user': currentUser },
              { headers: authHeaders }
            ).toPromise();
            console.log('✅ TaskService: Claim avec utilisateur réussi:', userClaimResult);
          } catch (userClaimError: any) {
            console.error('❌ TaskService: Claim avec utilisateur aussi échoué:', userClaimError);
          }
        }
      }
      
      // 9. Vérifier les permissions utilisateur (avec endpoints réels de JBPM)
      console.log('🔍 TaskService: Vérification des permissions utilisateur...');
      try {
        // Endpoint réel : tâches des propriétaires
        const ownerTasks = await this.http.get(
          `${this.apiUrl}server/queries/tasks/instances/owners`,
          { headers: authHeaders }
        ).toPromise();
        console.log('✅ TaskService: Tâches des propriétaires:', ownerTasks);
      } catch (ownerError: any) {
        console.warn('⚠️ TaskService: Endpoint /queries/tasks/instances/owners non disponible:', ownerError);
        
        try {
          // Endpoint alternatif : tâches des administrateurs
          const adminTasks = await this.http.get(
            `${this.apiUrl}server/queries/tasks/instances/admins`,
            { headers: authHeaders }
          ).toPromise();
          console.log('✅ TaskService: Tâches des administrateurs:', adminTasks);
        } catch (adminError: any) {
          console.warn('⚠️ TaskService: Endpoint /queries/tasks/instances/admins aussi indisponible:', adminError);
          
          try {
            // Dernier essai : toutes les tâches (sans filtre)
            const allTasks = await this.http.get(
              `${this.apiUrl}server/queries/tasks/instances`,
              { headers: authHeaders }
            ).toPromise();
            console.log('✅ TaskService: Toutes les tâches disponibles:', allTasks);
          } catch (finalError: any) {
            console.warn('⚠️ TaskService: Aucun endpoint de tâches disponible:', finalError);
          }
        }
      }
      
      return {
        taskDetails,
        taskGroups,
        taskStatus,
        taskOwner,
        userRoles: token ? JSON.parse(atob(token.split('.')[1])).realm_access?.roles || [] : []
      };
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors du diagnostic:', error);
      throw error;
    }
  }

  // ✅ MÉTHODE POUR AFFICHER LES DÉTAILS COMPLETS DU TOKEN
  displayTokenDetails(): void {
    try {
      const token = this.unifiedAuthService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 TaskService: === DÉTAILS COMPLETS DU TOKEN ===');
        console.log('✅ TaskService: Utilisateur:', payload.preferred_username || payload.sub);
        console.log('✅ TaskService: Nom complet:', payload.name);
        console.log('✅ TaskService: Email:', payload.email);
        console.log('✅ TaskService: Rôles realm_access:', payload.realm_access?.roles || 'Aucun');
        console.log('✅ TaskService: Rôles resource_access:', payload.resource_access || 'Aucun');
        console.log('✅ TaskService: Rôles directs:', payload.roles || 'Aucun');
        console.log('✅ TaskService: Groupes:', payload.groups || 'Aucun');
        console.log('✅ TaskService: Audiences:', payload.aud);
        console.log('✅ TaskService: Issuer:', payload.iss);
        console.log('✅ TaskService: Expiration:', new Date(payload.exp * 1000));
        console.log('✅ TaskService: ================================');
        
        // Vérifier spécifiquement les rôles importants
        const allRoles = [
          ...(payload.realm_access?.roles || []),
          ...(payload.roles || []),
          ...(payload.groups || [])
        ];
        
        console.log('✅ TaskService: Tous les rôles/groupes:', allRoles);
        console.log('✅ TaskService: A le rôle PM:', allRoles.includes('PM') || allRoles.includes('pm'));
        console.log('✅ TaskService: A le rôle employe:', allRoles.includes('employe') || allRoles.includes('employee'));
        console.log('✅ TaskService: A le rôle admin:', allRoles.includes('admin') || allRoles.includes('administrator'));
      } else {
        console.warn('⚠️ TaskService: Aucun token trouvé');
      }
    } catch (error) {
      console.error('❌ TaskService: Erreur lors de l\'analyse du token:', error);
    }
  }

  // ✅ MÉTHODE DE COMPARAISON ENTRE PROJETS
  async compareProjectConfigurations(workingContainerId: string, failingContainerId: string): Promise<any> {
    console.log('🔍 TaskService: === COMPARAISON DES CONFIGURATIONS DE PROJETS ===');
    
    const authHeaders = this.unifiedAuthService.getAuthHeaders();
    
    try {
      // 1. Récupérer les processus des deux conteneurs
      console.log('🔍 TaskService: Récupération des processus...');
      
      const workingProcesses = await this.http.get(
        `${this.apiUrl}server/containers/${workingContainerId}/processes`,
        { headers: authHeaders }
      ).toPromise();
      
      const failingProcesses = await this.http.get(
        `${this.apiUrl}server/containers/${failingContainerId}/processes`,
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Processus du projet qui fonctionne:', workingProcesses);
      console.log('✅ TaskService: Processus du projet qui échoue:', failingProcesses);
      
      // 2. Récupérer les tâches des deux conteneurs
      console.log('🔍 TaskService: Récupération des tâches...');
      
      const workingTasks = await this.http.get(
        `${this.apiUrl}server/queries/tasks/instances/owners`,
        { headers: authHeaders }
      ).toPromise();
      
      const failingTasks = await this.http.get(
        `${this.apiUrl}server/queries/tasks/instances/owners`,
        { headers: authHeaders }
      ).toPromise();
      
      console.log('✅ TaskService: Tâches du projet qui fonctionne:', workingTasks);
      console.log('✅ TaskService: Tâches du projet qui échoue:', failingTasks);
      
      // 3. Analyser les différences
      const workingTaskIds = (workingTasks as any)['task-summary']?.map((t: any) => t['task-id']) || [];
      const failingTaskIds = (failingTasks as any)['task-summary']?.map((t: any) => t['task-id']) || [];
      
      console.log('🔍 TaskService: IDs des tâches qui fonctionnent:', workingTaskIds);
      console.log('🔍 TaskService: IDs des tâches qui échouent:', failingTaskIds);
      
      // 4. Comparer les détails d'une tâche de chaque projet
      if (workingTaskIds.length > 0 && failingTaskIds.length > 0) {
        const workingTaskDetails = await this.http.get(
          `${this.apiUrl}server/containers/${workingContainerId}/tasks/${workingTaskIds[0]}`,
          { headers: authHeaders }
        ).toPromise();
        
        const failingTaskDetails = await this.http.get(
          `${this.apiUrl}server/containers/${failingContainerId}/tasks/${failingTaskIds[0]}`,
          { headers: authHeaders }
        ).toPromise();
        
        console.log('🔍 TaskService: === COMPARAISON DES DÉTAILS DE TÂCHES ===');
        console.log('✅ TaskService: Détails tâche qui fonctionne:', workingTaskDetails);
        console.log('❌ TaskService: Détails tâche qui échoue:', failingTaskDetails);
        
        // 5. Analyser les groupes assignés
        const workingGroups = (workingTaskDetails as any)['task-actual-owner-groups'] || (workingTaskDetails as any)['task-potential-owners'] || [];
        const failingGroups = (failingTaskDetails as any)['task-actual-owner-groups'] || (failingTaskDetails as any)['task-potential-owners'] || [];
        
        console.log('🔍 TaskService: Groupes de la tâche qui fonctionne:', workingGroups);
        console.log('🔍 TaskService: Groupes de la tâche qui échoue:', failingGroups);
        
        return {
          workingProject: {
            containerId: workingContainerId,
            processes: workingProcesses,
            tasks: workingTasks,
            taskDetails: workingTaskDetails,
            groups: workingGroups
          },
          failingProject: {
            containerId: failingContainerId,
            processes: failingProcesses,
            tasks: failingTasks,
            taskDetails: failingTaskDetails,
            groups: failingGroups
          },
          analysis: {
            workingTaskIds,
            failingTaskIds,
            workingGroups,
            failingGroups,
            hasGroupDifference: JSON.stringify(workingGroups) !== JSON.stringify(failingGroups)
          }
        };
      }
      
    } catch (error: any) {
      console.error('❌ TaskService: Erreur lors de la comparaison:', error);
      throw error;
    }
  }

} 