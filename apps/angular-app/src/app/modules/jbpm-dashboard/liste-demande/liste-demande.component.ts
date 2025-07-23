import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from "@angular/router";
import { NewRequestComponent } from '../new-request/new-request.component';
import { ContainerService } from '../../../shared/services/container.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/service/user/auth.service';

// Interface pour les types de processus
interface ProcessType {
  'process-id': string;
  'process-name': string;
  'process-version': string;
  'container-id': string;
  'container-alias'?: string;
}

@Component({
  selector: 'app-liste-demande',
  templateUrl: './liste-demande.component.html',
  styleUrl: './liste-demande.component.scss'
})
export class ListeDemandeComponent implements OnInit, OnDestroy {
  // Data
  containers: any[] = [];
  processTypes: ProcessType[] = [];
  filteredProcessTypes: ProcessType[] = [];
  
  // Search
  searchTerm: string = '';
  
  // Loading states
  isLoadingContainers = false;
  isLoadingProcesses = false;
  
  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();
  userGroups: string[] = [];
  // Mapping temporaire processId -> groupe (à adapter si l'API expose le champ)
  private processGroupMap: { [processId: string]: string } = {
    // 'process-id': 'NOM_DU_GROUPE',
    // Exemple : 'missionNational': 'HR'
  };

  selectedProcess: any = null;
  showStartModal: boolean = false;

  constructor(
    private router: Router, 
    public dialog: MatDialog,
    private containerService: ContainerService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.authService.getGroups$().subscribe((groups: string[]) => {
      this.userGroups = groups;
      this.applyGroupFilter();
    });
    await this.loadProcessTypes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all containers and their processes
   */
  private async loadProcessTypes(): Promise<void> {
    try {
      this.isLoadingContainers = true;
      const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);
      const containersResult = await this.containerService.listContainers();
      this.containers = containersResult || [];
      let allProcesses: any[] = [];
      for (const container of this.containers) {
        const { processes } = await this.containerService.displayAllProcesses(container['container-id'], defaultHeader);
        // Filtrage dynamique : ne garde que les process principaux démarrables
        allProcesses = allProcesses.concat((processes || []).filter((p: any) => p['is-executable'] === true));
      }
      this.processTypes = allProcesses;
      console.log('Liste des process proposés :', this.processTypes.map((p: any) => p['process-id']));
      this.applyGroupFilter();
    } catch (error) {
      this.isLoadingContainers = false;
      this.processTypes = [];
    } finally {
      this.isLoadingContainers = false;
    }
  }

  /**
   * Load all processes from all containers
   */
  private async loadAllProcesses(): Promise<void> {
    this.processTypes = [];
    const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);
    for (const container of this.containers) {
      try {
        const containerId = container['container-id'];
        const processesResult = await this.containerService.displayAllProcesses(containerId, defaultHeader);
        const processes = processesResult.processes || [];
        const containerProcesses: ProcessType[] = processes.map((process: any) => ({
          'process-id': process['process-id'],
          'process-name': process['process-name'],
          'process-version': process['process-version'],
          'container-id': containerId,
          'container-alias': container['container-alias']
          // Ajoute ici le champ group si dispo dans process
          // group: process['group'] || undefined
        }));
        this.processTypes.push(...containerProcesses);
      } catch (error) {
        console.warn(`Erreur lors du chargement des processus pour le container ${container['container-id']}:`, error);
      }
    }
  }

  /**
   * Filter processes based on search term
   */
  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProcessTypes = [...this.processTypes];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredProcessTypes = this.processTypes.filter(process =>
        process['process-name'].toLowerCase().includes(searchLower) ||
        (process['container-alias'] && process['container-alias'].toLowerCase().includes(searchLower))
      );
    }
  }

  applyGroupFilter() {
    if (this.userGroups.length) {
      // Si le champ group existe dans processTypes, décommente la ligne suivante et adapte
      // this.filteredProcessTypes = this.processTypes.filter(process => this.userGroups.includes(process.group));
      // Sinon, utilise le mapping temporaire
      this.filteredProcessTypes = this.processTypes.filter(process => {
        const group = this.processGroupMap[process['process-id']];
        return group ? this.userGroups.includes(group) : true; // true = visible pour tous si pas de mapping
      });
    } else {
      this.filteredProcessTypes = [...this.processTypes];
    }
  }

  /**
   * Open new request dialog for a specific process
   */
  startProcess(process: ProcessType): void {
    const dialogRef = this.dialog.open(NewRequestComponent, {
      width: '600px',
      data: { 
        processType: process,
        containerId: process['container-id']
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'created') {
          // Optionally refresh the list or navigate
          console.log('Nouveau processus créé avec succès');
        }
      });
  }

  onClickStart(process: any) {
    this.selectedProcess = process;
    this.showStartModal = true;
  }

  onConfirmStart() {
    if (this.selectedProcess) {
      this.startProcess(this.selectedProcess);
      this.showStartModal = false;
    }
  }

  /**
   * Get display name for process
   */
  getProcessDisplayName(process: ProcessType): string {
    return process['process-name'] || 'Processus sans nom';
  }

  /**
   * Get container display name
   */
  getContainerDisplayName(process: ProcessType): string {
    return process['container-alias'] || process['container-id'] || 'Container inconnu';
  }
}
