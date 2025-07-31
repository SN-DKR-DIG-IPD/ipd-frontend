import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProcessInstanceService } from '../../shared/services/process-instance.service';
import { ContainerService } from '../../shared/services/container.service';
import { TaskService } from '../../shared/services/task.service';
import { ProcessInstanceType } from '@jbpm/domain';
import { MatDialog } from '@angular/material/dialog';
import { NewRequestComponent } from '../jbpm-dashboard/new-request/new-request.component';
import { Subject, takeUntil } from 'rxjs';
import { ListeInstanceDemandeComponent } from '../jbpm-dashboard/liste-instance-demande/liste-instance-demande.component';

// Interface étendue pour le taux de complétude
interface ProcessInstanceWithTaux extends ProcessInstanceType {
  tauxCompletu?: number;
}

// Interface pour les indicateurs
interface DashboardIndicators {
  totalDemandesOM: number;
  totalOMNationale: number;
  totalOMInternationale: number;
}

// Interface pour la pagination
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
  showEllipsis: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Pagination
  pagination: PaginationState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
    pages: [],
    showEllipsis: false
  };

  // Data
  processList: ProcessInstanceWithTaux[] = [];
  filteredProcessList: ProcessInstanceWithTaux[] = [];
  containers: any[] = [];
  
  // Filters
  selectedContainerId: string = '';
  selectedTypeOM: string = '';
  
  // Modal state
  selectedInstanceDetails: ProcessInstanceWithTaux | null = null;
  
  // Indicators
  indicators: DashboardIndicators = {
    totalDemandesOM: 0,
    totalOMNationale: 0,
    totalOMInternationale: 0
  };

  // All processes for indicators calculation
  allProcessList: ProcessInstanceWithTaux[] = [];

  // Loading states
  isLoadingContainers = false;
  isLoadingProcesses = false;
  isLoadingDetails = false;

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  // Current date for display
  currentDate = new Date();

  @ViewChild('listeInstanceDemande') listeInstanceDemande!: ListeInstanceDemandeComponent;

  constructor(
    private processInstanceService: ProcessInstanceService,
    private containerService: ContainerService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.initializeDashboard();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize dashboard data
   */
  private async initializeDashboard(): Promise<void> {
    console.log('Dashboard: Initialisation...');
    
    // Attendre que les headers d'authentification soient configurés
    await this.waitForAuthHeaders();
    
    try {
      this.isLoadingContainers = true;
      await this.loadContainers();
      
      if (this.containers.length > 0) {
        this.selectedContainerId = this.containers[0]['container-id'];
        await this.loadProcesses();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du dashboard:', error);
    } finally {
      this.isLoadingContainers = false;
    }
  }

  private async waitForAuthHeaders(): Promise<void> {
    console.log('Dashboard: Attente des headers d\'authentification...');
    
    // Attendre jusqu'à 10 secondes que les headers soient configurés
    for (let i = 0; i < 100; i++) {
      const defaultHeader = sessionStorage.getItem('defaultHeader');
      if (defaultHeader) {
        try {
          const parsedHeader = JSON.parse(defaultHeader);
          if (parsedHeader.Authorization) {
            console.log('Dashboard: Headers d\'authentification trouvés');
            return;
          }
        } catch (error) {
          console.log('Dashboard: Erreur parsing headers, attente...');
        }
      }
      
      // Attendre 100ms entre chaque vérification
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.warn('Dashboard: Aucun header d\'authentification trouvé après 10 secondes');
  }

  /**
   * Load containers from API
   */
  private async loadContainers(): Promise<void> {
    try {
      this.isLoadingContainers = true;
      const result = await this.containerService.listContainers();
      this.containers = result || [];
      
      // Load all processes for indicators
      await this.loadAllProcessesForIndicators();
      this.calculateIndicators();
      
      if (this.containers.length > 0) {
        this.selectedContainerId = this.containers[0]['container-id'];
        await this.loadProcesses();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des containers:', error);
      throw error;
    } finally {
      this.isLoadingContainers = false;
    }
  }

  /**
   * Load all processes from all containers for indicators calculation
   */
  private async loadAllProcessesForIndicators(): Promise<void> {
    this.allProcessList = [];
    console.log('Dashboard: Chargement des processus pour les indicateurs...');
    
    for (const container of this.containers) {
      try {
        const containerId = container['container-id'];
        console.log('Dashboard: Chargement des processus pour le container:', containerId);
        
        // Laisser l'intercepteur gérer l'authentification
        const result = await this.processInstanceService.getAllProcessInstances(containerId);
        const processList = result['process-instance'] || [];
        this.allProcessList.push(...processList);
        
        console.log('Dashboard: Processus chargés pour le container', containerId, ':', processList.length);
      } catch (error) {
        console.warn(`Erreur lors du chargement des processus pour le container ${container['container-id']}:`, error);
      }
    }
    
    console.log('Dashboard: Total des processus chargés:', this.allProcessList.length);
  }

  /**
   * Load processes for selected container
   */
  async loadProcesses(): Promise<void> {
    if (!this.selectedContainerId) return;
    
    try {
      this.isLoadingProcesses = true;
      console.log('Dashboard: Chargement des processus pour le container:', this.selectedContainerId);
      
      // Laisser l'intercepteur gérer l'authentification
      const result = await this.processInstanceService.getAllProcessInstances(this.selectedContainerId);
      
      this.processList = result['process-instance'] || [];
      console.log('Dashboard: Processus chargés:', this.processList.length);
      
      // Calculate completion rate for each process using the new service
      await this.calculateCompletionRates();
      
      this.filteredProcessList = [...this.processList];
      this.updatePagination();
    } catch (error) {
      console.error('Erreur lors du chargement des processus:', error);
    } finally {
      this.isLoadingProcesses = false;
    }
  }

  /**
   * Calculate completion rates for all processes using TaskService
   */
  private async calculateCompletionRates(): Promise<void> {
    console.log('Dashboard: Calcul des taux de complétude...');
    
    for (const instance of this.processList) {
      try {
        // Laisser l'intercepteur gérer l'authentification
        (instance as ProcessInstanceWithTaux).tauxCompletu = 
          await this.taskService.calculateTaskCompletionRate(instance['process-instance-id']);
      } catch (error) {
        console.warn(`Erreur lors du calcul du taux de complétude pour l'instance ${instance['process-instance-id']}:`, error);
        (instance as ProcessInstanceWithTaux).tauxCompletu = 0;
      }
    }
    
    console.log('Dashboard: Taux de complétude calculés pour', this.processList.length, 'processus');
  }

  /**
   * Handle container type change
   */
  onTypeOMChange(containerId: string): void {
    this.selectedContainerId = containerId;
    this.applyFilter();
  }

  /**
   * Apply filters to process list
   */
  applyFilter(): void {
    if (this.selectedContainerId) {
      this.filteredProcessList = this.processList.filter(p =>
        (p['container-id'] || '').toString().trim().toLowerCase() === 
        this.selectedContainerId.toString().trim().toLowerCase()
      );
    } else {
      this.filteredProcessList = [...this.processList];
    }
    
    this.pagination.totalItems = this.filteredProcessList.length;
    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Update pagination state
   */
  private updatePagination(): void {
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
    this.calculateVisiblePages();
    this.updateDisplayedRange();
  }

  /**
   * Calculate visible pages for pagination
   */
  private calculateVisiblePages(): void {
    const visiblePages = [];
    const maxVisible = 3;

    for (let i = 1; i <= Math.min(maxVisible, this.pagination.totalPages); i++) {
      visiblePages.push(i);
    }

    this.pagination.pages = visiblePages;
    this.pagination.showEllipsis = this.pagination.totalPages > maxVisible;
  }

  /**
   * Update displayed range for pagination
   */
  private updateDisplayedRange(): void {
    this.pagination.startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
    this.pagination.endIndex = Math.min(
      this.pagination.startIndex + this.pagination.itemsPerPage - 1, 
      this.pagination.totalItems
    );
  }

  /**
   * Navigation methods
   */
  gotoPage(page: number): void {
    this.pagination.currentPage = page;
    this.updateDisplayedRange();
  }

  previousPage(): void {
    if (this.pagination.currentPage > 1) {
      this.pagination.currentPage--;
      this.updateDisplayedRange();
    }
  }

  nextPage(): void {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.pagination.currentPage++;
      this.updateDisplayedRange();
    }
  }

  onItemsPerPageChange(): void {
    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Open new request dialog
   */
  ouvrirDialogNouvelleDemande(): void {
    const dialogRef = this.dialog.open(NewRequestComponent, {
      width: '600px',
      data: { typeOM: this.selectedContainerId }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'created') {
          setTimeout(() => {
            this.loadProcesses();
            if (this.listeInstanceDemande) {
              this.listeInstanceDemande.reload();
            }
          }, 700);
        }
      });
  }

  /**
   * Get status CSS class
   */
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'VALIDÉE': return 'bg-green-100 text-green-700';
      case 'REJETÉE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  /**
   * Format date for display
   */
  formatDate(val: any): string {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR');
  }





  /**
   * Calculate dashboard indicators
   */
  private calculateIndicators(): void {
    this.indicators.totalDemandesOM = this.allProcessList.length;
    
    // OM nationale = containers dont l'id contient 'national' ou 'missionom'
    this.indicators.totalOMNationale = this.containers.filter(c =>
      (c['container-id'] || '').toLowerCase().includes('national') ||
      (c['container-id'] || '').toLowerCase().includes('missionom')
    ).length;
    
    // OM internationale = containers dont l'id contient 'international'
    this.indicators.totalOMInternationale = this.containers.filter(c =>
      (c['container-id'] || '').toLowerCase().includes('international')
    ).length;
  }

  /**
   * Get short container name without version
   */
  getTypeOMShort(containerId: string): string {
    if (!containerId) return '';
    return containerId.split('_')[0];
  }
}
