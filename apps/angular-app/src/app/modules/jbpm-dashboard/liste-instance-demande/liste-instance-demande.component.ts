import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ProcessInstanceService } from '../../../shared/services/process-instance.service';
import { ContainerService } from '../../../shared/services/container.service';
import { TaskService } from '../../../shared/services/task.service';
import { IDiagramAPI, IFormAPI } from '@jbpm/domain';
import { DiagramAPI, FormAPI } from '../../../injections';
import { UnifiedAuthService } from '../../../core/service/unified-auth.service';

interface InstanceRow {
  id: number;
  type: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  responsable: string;
  priorite: string;
  approbation: string;
  taux: number;
  containerId: string;
  variables: any;
  currentTask?: string;
  assignedTo?: string;
}

@Component({
  selector: 'app-liste-instance-demande',
  templateUrl: './liste-instance-demande.component.html',
})
export class ListeInstanceDemandeComponent implements OnInit {
  isLoading = false;
  errorMsg = '';
  rows: InstanceRow[] = [];
  filters = {
    reference: '',
    typeOM: '',
    dateDebut: '',
    statut: ''
  };
  typeOMList: string[] = [];
  filteredRows: InstanceRow[] = [];
  containers: any[] = [];

  @Output() openDetailRequest = new EventEmitter<any>();

  // Modal state
  showDetailModal = false;
  selectedTaskDetail: any = null;
  selectedUserTaskInfos: any = {};
  
  // Task form modal state (pour l'approche jbpmPortal)
  showTaskFormModal = false;
  selectedTaskForm: string = '';
  selectedTaskInfo: { containerId: string; taskId: number } | null = null;
  constructor(
    private processInstanceService: ProcessInstanceService,
    private containerService: ContainerService,
    private taskService: TaskService,
    @Inject(DiagramAPI) private diagramAPI: IDiagramAPI,
    @Inject(FormAPI) private formAPI: IFormAPI,
    private unifiedAuthService: UnifiedAuthService
  ) {}

  async ngOnInit() {
    await this.reload();
    
    // Test de connectivité pour le diagramme
    await this.testDiagramAPI();
  }

  /**
   * Test de connectivité pour l'API diagramme
   */
  async testDiagramAPI() {
    try {
      console.log('🧪 Test de connectivité pour l\'API diagramme...');
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      const xmlSvgHeaders = {
        'Accept': 'application/xml, text/xml, */*'
      };
      
      // Test avec un container et une instance fictifs pour voir si l'API répond
      if (this.containers.length > 0) {
        const testContainerId = this.containers[0]['container-id'];
        console.log('🧪 Test avec container:', testContainerId);
        
                 try {
           const testResult = await this.diagramAPI.getProcessInstanceDiagram(
             testContainerId,
             999999, // ID fictif pour tester
             xmlSvgHeaders
           );
          console.log('✅ API diagramme accessible');
        } catch (error) {
          console.log('⚠️ API diagramme accessible mais erreur 404 attendue pour ID fictif');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du test de connectivité:', error);
    }
  }

  async reload() {
    if (this.isLoading) return; // Empêche les rechargements multiples
    this.isLoading = true;
    this.errorMsg = '';
    this.rows = [];
    this.typeOMList = [];
    try {
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      const containersResult = await this.containerService.listContainers();
      this.containers = containersResult || [];
      // Chargement des instances de tous les containers en parallèle
      const allInstances = await Promise.all(containersResult.map(async (container: any) => {
        const containerId = container['container-id'];
        const instancesResult = await this.processInstanceService.getAllProcessInstances(containerId, authHeaders);
        const instances = instancesResult['process-instance'] || [];
        // Chargement des variables de toutes les instances en parallèle
        const instanceRows = await Promise.all(instances.map(async (instance: any) => {
          try {
            const variables = await this.processInstanceService.getProcessInstanceVariables(containerId, instance['process-instance-id'], authHeaders);
            const instanceData = instance as any;
            // DEBUG : log des variables et de l'instance pour comprendre pourquoi date de fin est absente
            console.log('Instance ID:', instance['process-instance-id']);
             console.log('Process Name:', instance['process-name']);
            console.log('variables:', variables);
            console.log('instanceData:', instanceData);
            const dateDebut = variables['dateDebut'] || instanceData['start-date'] || '';
            const dateFin = variables['dateFin'] || instanceData['end-date'] || '';
            const approbateur = variables['approbateur'] || variables['approbation'] || instanceData['initiator'] || '';
            const roleApprobateur = variables['roleApprobateur'] || variables['role_approbateur'] || '';
            // Calculer le taux de complétude dynamiquement
            let taux = 0;
            try {
              const tasksResult = await this.taskService.getTasksForProcessInstance(instance['process-instance-id']);
              const tasks = tasksResult['task-summary'] || [];
              
              if (Array.isArray(tasks) && tasks.length > 0) {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter((task: any) => 
                  task['task-status'] === 'Completed' || task['task-status'] === 'Terminé'
                ).length;
                
                // Calculer le taux basé sur les tâches complétées
                const taskBasedRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                // Ajuster le taux selon l'état du processus
                const processState = String(instance['process-instance-state']);
                if (processState === '2') { // Complété
                  taux = 100;
                } else if (processState === '1') { // Actif
                  // Si des tâches sont en cours, donner un taux de progression
                  const activeTasks = tasks.filter((task: any) => 
                    task['task-status'] === 'Ready' || task['task-status'] === 'InProgress'
                  ).length;
                  
                  if (activeTasks > 0) {
                    // Calculer le taux basé sur la progression dans le workflow
                    const workflowProgress = this.calculateWorkflowProgress(instance['process-name'], tasks);
                    taux = Math.max(taskBasedRate, workflowProgress);
                  } else {
                    taux = taskBasedRate;
                  }
                } else {
                  taux = taskBasedRate;
                }
                
                console.log('📊 Taux calculé pour l\'instance', instance['process-instance-id'], ':', taux + '%');
              } else {
                // Si aucune tâche trouvée, calculer basé sur l'état du processus
                const processState = String(instance['process-instance-state']);
                if (processState === '2') {
                  taux = 100;
                } else if (processState === '1') {
                  taux = 25; // Taux initial pour les processus actifs
                } else {
                  taux = 0;
                }
              }
            } catch (error) {
              console.log('⚠️ Impossible de calculer le taux pour l\'instance:', instance['process-instance-id']);
              // Fallback basé sur l'état du processus
              const processState = String(instance['process-instance-state']);
              if (processState === '2') {
                taux = 100;
              } else if (processState === '1') {
                taux = 25;
              } else {
                taux = 0;
              }
            }
            const typeOM = variables['typeOM'] || instance['process-name'] || '';
            if (!this.rows.some(r => r.id === instance['process-instance-id'])) {
              // Récupérer les informations de tâche actuelle
              let currentTask = 'En cours...';
              let assignedTo = 'Non assigné';
              
              try {
                // Récupérer les tâches de l'instance
                const tasksResult = await this.taskService.getTasksForProcessInstance(instance['process-instance-id']);
                const tasks = tasksResult['task-summary'] || [];
                
                if (Array.isArray(tasks) && tasks.length > 0) {
                  // Filtrer les tâches actives
                  const activeTasks = tasks.filter((task: any) => 
                    task['task-status'] === 'Ready' || task['task-status'] === 'InProgress'
                  );
                  
                  if (activeTasks.length > 0) {
                    const firstActiveTask = activeTasks[0];
                    currentTask = firstActiveTask['task-name'] || 'Tâche active';
                    assignedTo = firstActiveTask['task-actual-owner'] || 'Non assigné';
                  }
                }
              } catch (error) {
                console.log('⚠️ Impossible de récupérer les tâches pour l\'instance:', instance['process-instance-id']);
              }
              
              const row: InstanceRow = {
                id: instance['process-instance-id'],
                type: typeOM,
                statut: this.formatStatus(String(instance['process-instance-state'])),
                dateDebut: this.formatDate(dateDebut),
                dateFin: dateFin ? this.formatDate(dateFin) : '',
                responsable: instance['initiator'] || '',
                priorite: variables['priority'] || '',
                approbation: variables['approbation'] || '',
                taux: taux,
                containerId,
                currentTask,
                assignedTo,
                variables: {
                  ...variables,
                  approbateur,
                  roleApprobateur
                }
              };
              this.rows.push(row);
              if (typeOM && this.typeOMList.indexOf(typeOM) === -1) {
                this.typeOMList.push(typeOM);
              }
              return row;
            }
            return null;
          } catch (error) {
            return null;
          }
        }));
        return instanceRows.filter(Boolean);
      }));
      // Aplatir le tableau de résultats
      this.rows = allInstances.flat(2).filter((row): row is InstanceRow => !!row);
      this.filteredRows = [...this.rows];
    } catch (err: any) {
      this.errorMsg = err?.message || 'Erreur lors du chargement des instances de processus.';
    } finally {
      this.isLoading = false;
    }
  }

  private formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      '1': 'Actif',
      '2': 'Complété',
      '3': 'Abandonné',
      '4': 'Suspendu',
      '5': 'En erreur'
    };
    return statusMap[status] || status;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (typeof date === 'number') return new Date(date).toISOString();
    if (date instanceof Date) return date.toISOString();
    if (date.timestamp) return new Date(date.timestamp).toISOString();
    if (date['java.util.Date']) return new Date(date['java.util.Date']).toISOString();
    return '';
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Actif': 'bg-green-100 text-green-800',
      'Complété': 'bg-blue-100 text-blue-800',
      'Abandonné': 'bg-red-100 text-red-800',
      'Suspendu': 'bg-yellow-100 text-yellow-800',
      'En erreur': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityBadgeClass(priority: string): string {
    const priorityClasses: { [key: string]: string } = {
      'Haute': 'bg-red-100 text-red-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Basse': 'bg-green-100 text-green-800'
    };
    return priorityClasses[priority] || 'bg-gray-100 text-gray-800';
  }

  getApprovalBadgeClass(approval: string): string {
    const approvalClasses: { [key: string]: string } = {
      'Approuvé': 'bg-green-100 text-green-800',
      'Refusé': 'bg-red-100 text-red-800',
      'En attente': 'bg-yellow-100 text-yellow-800'
    };
    return approvalClasses[approval] || 'bg-gray-100 text-gray-800';
  }

  getCurrentTaskBadgeClass(task?: string): string {
    if (!task) return 'bg-gray-100 text-gray-800';
    
    const taskClasses: { [key: string]: string } = {
      'PM Evaluation': 'bg-blue-100 text-blue-800',
      'HR Evaluation': 'bg-purple-100 text-purple-800',
      'Self Evaluation': 'bg-green-100 text-green-800'
    };
    return taskClasses[task] || 'bg-gray-100 text-gray-800';
  }

  getAssignedToBadgeClass(assignedTo?: string): string {
    if (!assignedTo) return 'bg-gray-100 text-gray-800';
    
    const assignedClasses: { [key: string]: string } = {
      'eddy': 'bg-purple-100 text-purple-800',
      'ibrahima': 'bg-blue-100 text-blue-800',
      'hussein': 'bg-orange-100 text-orange-800'
    };
    return assignedClasses[assignedTo] || 'bg-gray-100 text-gray-800';
  }

  applyFilters() {
    this.filteredRows = this.rows.filter(row => {
      const refMatch = !this.filters.reference || row.id.toString().includes(this.filters.reference);
      const typeMatch = !this.filters.typeOM || row.type === this.filters.typeOM;
      const dateMatch = !this.filters.dateDebut || (row.dateDebut && row.dateDebut.startsWith(this.filters.dateDebut));
      const statutMatch = !this.filters.statut || row.statut === this.filters.statut;
      return refMatch && typeMatch && dateMatch && statutMatch;
    });
  }

  /**
   * Ouvre la modale de détails pour une instance de processus
   */
  async openDetailModal(row: InstanceRow) {
    console.log('🔍 Ouverture de la modale de détails pour:', row);
    
    try {
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Combiner les headers d'authentification avec les headers XML/SVG
      const xmlSvgHeaders = {
        'Accept': 'application/xml, text/xml, */*',
        'Authorization': authHeaders.get('Authorization') || '',
        'Content-Type': 'application/json'
      };
      
             console.log('🔍 Tentative de récupération du diagramme pour:', {
         containerId: row.containerId,
         processInstanceId: row.id,
         headers: xmlSvgHeaders
       });
       
       // Vérifier que le containerId est valide
       if (!row.containerId) {
         console.error('❌ ContainerId manquant pour l\'instance:', row.id);
         throw new Error('ContainerId manquant');
       }
      
                           // Essayer directement de récupérer le diagramme de la définition de processus
        let processInstanceDiagram;
        try {
          // D'abord, récupérer la liste des processus disponibles dans le container
          console.log('🔍 Récupération de la liste des processus pour le container:', row.containerId);
          const processesResponse = await this.containerService.displayAllProcesses(row.containerId, xmlSvgHeaders);
          const availableProcesses = processesResponse?.processes || [];
          console.log('📋 Processus disponibles:', availableProcesses.map((p: any) => p['process-id'] || p.id || p.name));
          
          // Utiliser le nom du processus depuis l'instance ou essayer de le trouver dans la liste
          let processId = row.type || row.variables?.processName;
          
          // Si le processId n'est pas dans la liste des processus disponibles, essayer de le trouver
          if (processId && !availableProcesses.some((p: any) => (p['process-id'] || p.id || p.name) === processId)) {
            console.log('⚠️ ProcessId non trouvé dans la liste, recherche d\'un processus compatible...');
            // Chercher un processus qui contient le nom ou qui est similaire
            const matchingProcess = availableProcesses.find((p: any) => {
              const processName = p['process-id'] || p.id || p.name;
              return processName && (
                processName.toLowerCase().includes(processId.toLowerCase()) ||
                processId.toLowerCase().includes(processName.toLowerCase())
              );
            });
            if (matchingProcess) {
              processId = matchingProcess['process-id'] || matchingProcess.id || matchingProcess.name;
              console.log('✅ Processus compatible trouvé:', processId);
            }
          }
          
          console.log('🔍 Tentative de récupération du diagramme avec processId:', processId);
          
                     // Essayer d'abord de récupérer le diagramme de l'instance de processus (avec l'état actuel)
           try {
             console.log('🔄 Tentative avec le diagramme de l\'instance de processus (ID:', row.id, ')');
             processInstanceDiagram = await this.diagramAPI.getProcessInstanceDiagram(
               row.containerId,
               row.id,
               xmlSvgHeaders
             );
             console.log('✅ Diagramme de l\'instance récupéré avec succès');
           } catch (instanceError) {
             console.log('⚠️ Impossible de récupérer le diagramme de l\'instance, fallback vers la définition...');
             
             // Fallback vers le diagramme de définition de processus
             if (processId) {
               console.log('🔄 Tentative avec la définition de processus:', processId);
               processInstanceDiagram = await this.diagramAPI.getProcessDiagram(
                 row.containerId,
                 processId,
                 xmlSvgHeaders
               );
             } else {
               // Fallback: essayer avec le premier processus disponible
               if (availableProcesses.length > 0) {
                 const firstProcess = availableProcesses[0];
                 const fallbackProcessId = firstProcess['process-id'] || firstProcess.id || firstProcess.name;
                 console.log('🔄 Fallback avec le premier processus disponible:', fallbackProcessId);
                 processInstanceDiagram = await this.diagramAPI.getProcessDiagram(
                   row.containerId,
                   fallbackProcessId,
                   xmlSvgHeaders
                 );
               } else {
                 // Dernier fallback: essayer des noms courants
                 const commonProcessNames = ['evaluation', 'Evaluation', 'demande_mission', 'demande-mission', 'mission'];
                 for (const name of commonProcessNames) {
                   try {
                     console.log('🔄 Tentative avec le processus par défaut:', name);
                     processInstanceDiagram = await this.diagramAPI.getProcessDiagram(
                       row.containerId,
                       name,
                       xmlSvgHeaders
                     );
                     console.log('✅ Diagramme récupéré avec le processus par défaut:', name);
                     break;
                   } catch (error) {
                     console.log('❌ Échec avec le processus par défaut:', name);
                     continue;
                   }
                 }
               }
             }
           }
          
          if (!processInstanceDiagram) {
            throw new Error('Aucun diagramme trouvé');
          }
          
          console.log('✅ Diagramme BPMN récupéré pour l\'instance', row.id);
          console.log('📏 Taille du diagramme:', processInstanceDiagram.length, 'caractères');
          console.log('🔍 Contenu du diagramme (premiers 200 caractères):', processInstanceDiagram.substring(0, 200));
          
        } catch (error) {
          console.error('❌ Impossible de récupérer le diagramme pour l\'instance', row.id, ':', error);
          processInstanceDiagram = '<div class="text-center text-gray-500 p-4">Diagramme non disponible</div>';
        }
      
      console.log('📊 Diagramme BPMN récupéré (longueur:', processInstanceDiagram.length, '):', processInstanceDiagram.substring(0, 200) + '...');
      
      // Récupérer les vraies tâches de l'instance
      console.log('🔍 === ANALYSE INSTANCE ' + row.id + ' ===');
      console.log('🔍 Container ID:', row.containerId);
      console.log('🔍 Process Name:', row.type);
      console.log('🔍 Instance State:', row.statut);
      let realTaskId = row.id; // Fallback vers l'ID de l'instance
      let realTaskName = row.type;
      
      try {
        // Récupérer l'utilisateur actuel
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const username = currentUser.preferred_username || currentUser.name || '';
        console.log('👤 Utilisateur actuel:', username);
        
        // Récupérer les tâches de l'utilisateur pour cette instance
        console.log('🔍 Récupération des tâches de l\'utilisateur pour l\'instance:', row.id);
        
        // Essayer d'abord de récupérer les tâches assignées à l'utilisateur
                 try {
           console.log('🔍 Appel à getUserTasks() pour l\'utilisateur actuel...');
           const userTasksResult = await this.taskService.getUserTasks();
           console.log('📋 Résultat brut de getUserTasks():', userTasksResult);
           
           const userTasks = userTasksResult['task-summary'] || [];
           console.log('📋 Tâches de l\'utilisateur (total):', userTasks.length);
           console.log('📋 Détails des tâches utilisateur:', userTasks);
          
                     // Filtrer les tâches qui appartiennent à cette instance
           console.log('🔍 Filtrage des tâches pour l\'instance:', row.id);
           console.log('🔍 Comparaison avec les task-proc-inst-id des tâches utilisateur...');
           
           const instanceTasks = userTasks.filter((task: any) => {
             const taskInstanceId = task['task-proc-inst-id'];
             const matches = taskInstanceId === row.id;
             console.log(`🔍 Tâche ${task['task-id']}: task-proc-inst-id=${taskInstanceId}, row.id=${row.id}, match=${matches}`);
             return matches;
           });
           
           console.log('📋 Tâches de l\'utilisateur pour cette instance:', instanceTasks);
          
                     if (instanceTasks.length > 0) {
             // Prendre la première tâche assignée à l'utilisateur
             const userTask = instanceTasks[0];
             realTaskId = userTask['task-id'];
             realTaskName = userTask['task-name'];
             console.log('✅ Tâche assignée à l\'utilisateur trouvée:', { realTaskId, realTaskName });
             console.log('📋 Détails de la tâche:', userTask);
           } else {
             console.log('⚠️ Aucune tâche assignée à l\'utilisateur, recherche de tâches disponibles...');
            
                         // Fallback : récupérer toutes les tâches de l'instance
             console.log('🔄 Fallback: Appel à getTasksForProcessInstance pour l\'instance', row.id);
             const tasksResult = await this.taskService.getTasksForProcessInstance(row.id);
             console.log('📋 Résultat brut de getTasksForProcessInstance:', tasksResult);
             
             const tasks = tasksResult['task-summary'] || [];
             console.log('📋 Toutes les tâches de l\'instance (total):', tasks.length);
             console.log('📋 Détails des tâches:', tasks);
            
            if (Array.isArray(tasks) && tasks.length > 0) {
              // Filtrer les tâches actives (Ready, InProgress)
              const activeTasks = tasks.filter((task: any) => 
                task['task-status'] === 'Ready' || task['task-status'] === 'InProgress'
              );
              
              console.log('📋 Tâches actives de l\'instance:', activeTasks);
              
              if (activeTasks.length > 0) {
                // Prendre la première tâche active
                const firstActiveTask = activeTasks[0];
                realTaskId = firstActiveTask['task-id'];
                realTaskName = firstActiveTask['task-name'];
                console.log('✅ Tâche active trouvée:', { realTaskId, realTaskName });
              }
            }
          }
                 } catch (userTasksError) {
           console.log('❌ ERREUR getUserTasks():', userTasksError);
           console.log('⚠️ Impossible de récupérer les tâches de l\'utilisateur, fallback vers toutes les tâches');
          
          // Fallback : récupérer toutes les tâches de l'instance
          const tasksResult = await this.taskService.getTasksForProcessInstance(row.id);
          const tasks = tasksResult['task-summary'] || [];
          
          if (Array.isArray(tasks) && tasks.length > 0) {
            const activeTasks = tasks.filter((task: any) => 
              task['task-status'] === 'Ready' || task['task-status'] === 'InProgress'
            );
            
            if (activeTasks.length > 0) {
              const firstActiveTask = activeTasks[0];
              realTaskId = firstActiveTask['task-id'];
              realTaskName = firstActiveTask['task-name'];
              console.log('✅ Tâche active trouvée (fallback):', { realTaskId, realTaskName });
            }
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des tâches:', error);
        console.log('⚠️ Utilisation de l\'ID d\'instance comme fallback');
      }
      
      // Créer un objet compatible avec DetailComponent
      const taskDetail = {
        'task-id': realTaskId, // Utiliser le vrai ID de tâche
        'task-name': realTaskName,
        'task-subject': `Instance ${row.id}`,
        'task-description': `Détails de l'instance ${row.id}`,
        'task-status': row.statut,
        'task-priority': 1,
        'task-is-skipable': false,
        'task-actual-owner': row.variables?.approbateur || '',
        'task-created-by': row.responsable,
        'task-created-on': { 'java.util.Date': new Date(row.dateDebut).getTime() },
        'task-activation-time': { 'java.util.Date': new Date(row.dateDebut).getTime() },
        'task-expiration-time': row.dateFin ? { 'java.util.Date': new Date(row.dateFin).getTime() } : undefined,
        'task-proc-inst-id': row.id,
        'task-proc-def-id': row.type,
        'task-container-id': row.containerId,
        'task-parent-id': -1,
        'correlation-key': row.id.toString(),
        'process-type': 1
      };

             // Récupérer les informations sur l'utilisateur actuel et son rôle
       const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
       
       // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
       const token = this.unifiedAuthService.getToken();
       let tokenInfo = {};
       if (token) {
         try {
           const payload = JSON.parse(atob(token.split('.')[1]));
           tokenInfo = payload;
           console.log('🔐 Informations du token JWT:', payload);
         } catch (error) {
           console.log('⚠️ Impossible de décoder le token JWT');
         }
       }
       
       // Combiner les groupes depuis l'objet user et le token JWT
       let userGroups = currentUser.groups || [];
       let userRoles = currentUser.roles || [];
       
       // Si les groupes ne sont pas dans l'objet user, essayer de les récupérer depuis le token
       if (userGroups.length === 0 && tokenInfo && (tokenInfo as any).realm_access && (tokenInfo as any).realm_access.roles) {
         userRoles = (tokenInfo as any).realm_access.roles;
         console.log('🔐 Rôles récupérés depuis le token JWT:', userRoles);
       }
       
       // Si les groupes ne sont pas dans l'objet user, essayer de les récupérer depuis le token
       if (userGroups.length === 0 && tokenInfo && (tokenInfo as any).groups) {
         userGroups = (tokenInfo as any).groups;
         console.log('🔐 Groupes récupérés depuis le token JWT:', userGroups);
       }
       
               console.log('👤 Utilisateur actuel:', currentUser);
        console.log('👥 Groupes de l\'utilisateur:', userGroups);
        console.log('🎭 Rôles de l\'utilisateur:', userRoles);
        console.log('🔐 Informations du token:', tokenInfo);
       
       const userTaskInfos = {
         [realTaskId]: { // Utiliser realTaskId comme clé pour correspondre au taskDetail
           processInstanceDetail: {
             initiator: row.responsable,
             'process-instance-id': row.id,
             'container-id': row.containerId
           },
           processInfo: {
             processName: realTaskName, // Utiliser realTaskName
             workItemParams: row.variables
           },
           workItemInfo: {
             'work-item-params': {
               GroupId: row.variables?.roleApprobateur || 'Non renseigné'
             }
           },
           processInstanceDiagram: processInstanceDiagram,
           // Informations sur l'utilisateur actuel pour le positionnement dans le diagramme
           currentUser: {
             username: currentUser.preferred_username || currentUser.name,
             groups: userGroups,
             roles: userRoles,
             tokenInfo: tokenInfo, // Informations du token JWT
             currentTask: realTaskName, // Utiliser realTaskName
             userPosition: this.getUserPositionInProcess(userGroups, realTaskName)
           }
         }
       };
       
       // Ajouter une entrée de fallback si realTaskId est différent de row.id
       if (realTaskId !== row.id) {
         userTaskInfos[row.id] = userTaskInfos[realTaskId];
       }

      // Résumé final pour l'instance
      console.log('📊 === RÉSUMÉ INSTANCE ' + row.id + ' ===');
      console.log('📋 realTaskId final:', realTaskId);
      console.log('📋 realTaskName final:', realTaskName);
      console.log('📋 Diagramme disponible:', processInstanceDiagram.length > 100 ? 'OUI' : 'NON');
      console.log('📋 Taille diagramme:', processInstanceDiagram.length, 'caractères');
      console.log('📋 === FIN ANALYSE INSTANCE ' + row.id + ' ===\n');
      
      // Émettre les données pour le composant parent
      this.openDetailRequest.emit({ taskDetail, userTaskInfos });

      // Ouvrir la modale directement
      this.selectedTaskDetail = taskDetail;
      this.selectedUserTaskInfos = userTaskInfos;
      this.showDetailModal = true;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du diagramme:', error);
      // Ouvrir la modale sans diagramme en cas d'erreur
      const taskDetail = {
        'task-id': row.id,
        'task-name': row.type,
        'task-subject': `Instance ${row.id}`,
        'task-description': `Détails de l'instance ${row.id}`,
        'task-status': row.statut,
        'task-priority': 1,
        'task-is-skipable': false,
        'task-actual-owner': row.variables?.approbateur || '',
        'task-created-by': row.responsable,
        'task-created-on': { 'java.util.Date': new Date(row.dateDebut).getTime() },
        'task-activation-time': { 'java.util.Date': new Date(row.dateDebut).getTime() },
        'task-expiration-time': row.dateFin ? { 'java.util.Date': new Date(row.dateFin).getTime() } : undefined,
        'task-proc-inst-id': row.id,
        'task-proc-def-id': row.type,
        'task-container-id': row.containerId,
        'task-parent-id': -1,
        'correlation-key': row.id.toString(),
        'process-type': 1
      };

      const userTaskInfos = {
        [row.id]: {
          processInstanceDetail: {
            initiator: row.responsable,
            'process-instance-id': row.id,
            'container-id': row.containerId
          },
          processInfo: {
            processName: row.type,
            workItemParams: row.variables
          },
          workItemInfo: {
            'work-item-params': {
              GroupId: row.variables?.roleApprobateur || 'Non renseigné'
            }
          },
          processInstanceDiagram: '<div class="text-center text-gray-500 p-4">Diagramme non disponible</div>'
        }
      };

      this.selectedTaskDetail = taskDetail;
      this.selectedUserTaskInfos = userTaskInfos;
      this.showDetailModal = true;
    }
  }

  /**
   * Ferme la modale de détails
   */
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedTaskDetail = null;
    this.selectedUserTaskInfos = {};
  }

     /**
    * Détermine la position de l'utilisateur dans le processus basée sur ses groupes/rôles
    */
   private getUserPositionInProcess(userGroups: string[], processType: string): string {
     console.log('🔍 Détermination de la position - Groupes:', userGroups, 'ProcessType:', processType);
     
     // Vérifier d'abord les groupes de l'utilisateur
     if (userGroups && userGroups.length > 0) {
       console.log('🔍 Vérification des groupes utilisateur:', userGroups);
       
       // Vérifier les variations possibles du groupe PM
       if (userGroups.some(group => 
         group.toLowerCase().includes('pm') || 
         group.toLowerCase().includes('project') || 
         group.toLowerCase().includes('manager')
       )) {
         console.log('✅ Utilisateur PM détecté');
         return 'PM Evaluation';
       }
       
       // Vérifier les variations possibles du groupe HR
       if (userGroups.some(group => 
         group.toLowerCase().includes('hr') || 
         group.toLowerCase().includes('human') || 
         group.toLowerCase().includes('ressources')
       )) {
         console.log('✅ Utilisateur HR détecté');
         return 'HR Evaluation';
       }
       
       // Vérifier les variations possibles du groupe USER
       if (userGroups.some(group => 
         group.toLowerCase().includes('user') || 
         group.toLowerCase().includes('employee') || 
         group.toLowerCase().includes('staff')
       )) {
         console.log('✅ Utilisateur standard détecté');
         return 'Self Evaluation';
       }
     }
     
     // Si aucun groupe spécifique n'est trouvé, essayer de détecter depuis le nom d'utilisateur
     const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
     const username = currentUser.preferred_username || currentUser.name || '';
     console.log('🔍 Vérification du nom d\'utilisateur:', username);
     
     if (username.toLowerCase().includes('pm') || username.toLowerCase().includes('manager')) {
       console.log('✅ PM détecté par le nom d\'utilisateur');
       return 'PM Evaluation';
     }
     
     if (username.toLowerCase().includes('hr')) {
       console.log('✅ HR détecté par le nom d\'utilisateur');
       return 'HR Evaluation';
     }
     
     // Fallback basé sur le type de processus
     if (processType.toLowerCase().includes('evaluation')) {
       console.log('⚠️ Aucun rôle spécifique détecté, utilisation du fallback');
       return 'Self Evaluation';
     }
     
     console.log('❌ Aucune position détectée');
     return 'Unknown Position';
   }

     /**
   * Gère la complétion d'une tâche - Approche jbpmPortal
   */
  async completeTask({containerId, taskId}: {containerId: string, taskId: number}): Promise<void> {
    console.log('🚀 === DÉBUT COMPLETE TASK (Composant parent) ===');
    console.log('📋 Paramètres reçus:', { containerId, taskId });
    
    try {
      // Récupérer le formulaire comme dans jbpmPortal
      // ✅ REMPLACÉ: sessionStorage par UnifiedAuthService
      const authHeaders = this.unifiedAuthService.getAuthHeaders();
      
      // Combiner les headers d'authentification avec les headers HTML
      const htmlHeaders = {
        'Content-Type': 'text/html',
        'Accept': 'text/html',
        'Authorization': authHeaders.get('Authorization') || ''
      };
      
      console.log('🔍 Récupération du formulaire jBPM...');
      const taskForm = await this.formAPI.getTaskInstanceForm(containerId, taskId, htmlHeaders);
      
      console.log('✅ Formulaire récupéré:', taskForm ? taskForm.substring(0, 200) + '...' : 'null');
      
      if (!taskForm) {
        console.error('❌ Aucun formulaire trouvé');
        return;
      }
      
      // Fermer le modal de détails et ouvrir le modal de formulaire
      this.closeDetailModal();
      
      // Stocker le formulaire et les informations de tâche
      this.selectedTaskForm = taskForm;
      this.selectedTaskInfo = { containerId, taskId };
      this.showTaskFormModal = true;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du formulaire:', error);
    }
  }

  /**
   * Gère la complétion d'une tâche (ancienne méthode)
   */
  onCompleteTask(event: any): void {
    console.log('✅ Tâche complétée:', event);
    this.closeDetailModal();
    
    // Mettre à jour le taux de complétude pour cette instance
    if (event && event.containerId && event.taskId) {
      this.updateCompletionRate(event.containerId, event.taskId);
    }
    
    // Recharger les données
    this.reload();
  }

  /**
   * Calcule la progression dans le workflow basée sur les tâches
   */
  private calculateWorkflowProgress(processName: string, tasks: any[]): number {
    // Définir les étapes du workflow pour le processus Evaluation
    const workflowSteps = ['Self Evaluation', 'HR Evaluation', 'PM Evaluation'];
    
    if (processName.toLowerCase().includes('evaluation')) {
      // Compter les tâches complétées par étape
      let completedSteps = 0;
      
      for (const step of workflowSteps) {
        const stepTasks = tasks.filter((task: any) => 
          task['task-name'] === step
        );
        
        if (stepTasks.length > 0) {
          const completedStepTasks = stepTasks.filter((task: any) => 
            task['task-status'] === 'Completed' || task['task-status'] === 'Terminé'
          );
          
          if (completedStepTasks.length === stepTasks.length) {
            completedSteps++;
          }
        }
      }
      
      // Calculer le pourcentage de progression
      return Math.round((completedSteps / workflowSteps.length) * 100);
    }
    
    // Pour les autres processus, utiliser un calcul simple
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task: any) => 
      task['task-status'] === 'Completed' || task['task-status'] === 'Terminé'
    ).length;
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  /**
   * Met à jour le taux de complétude pour une instance spécifique
   */
  private async updateCompletionRate(containerId: string, taskId: number): Promise<void> {
    try {
      // Récupérer l'instance associée à cette tâche
      const tasksResult = await this.taskService.getTasksForProcessInstance(taskId);
      const tasks = tasksResult['task-summary'] || [];
      
      if (Array.isArray(tasks) && tasks.length > 0) {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task: any) => 
          task['task-status'] === 'Completed' || task['task-status'] === 'Terminé'
        ).length;
        
        const newRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Mettre à jour le taux dans le tableau
        const instanceRow = this.rows.find(row => row.id === taskId);
        if (instanceRow) {
          instanceRow.taux = newRate;
          console.log('📈 Taux de complétude mis à jour pour l\'instance', taskId, ':', newRate + '%');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du taux de complétude:', error);
    }
  }
} 