import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../shared/services/task.service';
import { ContainerService } from '../../../shared/services/container.service';

// Interface pour un processus
interface ProcessDefinition {
  'process-id': string;
  'process-name': string;
  'process-version': string;
  'process-package': string;
  'container-id': string;
  'dynamic': boolean;
  'dynamic-form': boolean;
}

// Interface pour un container
interface Container {
  'container-id': string;
  'container-alias': string;
  'status': string;
}

@Component({
  selector: 'app-process-selector',
  templateUrl: './process-selector.component.html',
  styleUrls: ['./process-selector.component.scss']
})
export class ProcessSelectorComponent implements OnInit {
  containers: Container[] = [];
  processes: ProcessDefinition[] = [];
  loading = true;
  error = '';
  selectedContainer: Container | null = null;
  selectedProcess: ProcessDefinition | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProcessSelectorComponent>,
    private taskService: TaskService,
    private containerService: ContainerService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🔍 ProcessSelector: Initialisation avec données:', this.data);
    await this.loadContainers();
  }

  async loadContainers(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      
      console.log('🔍 ProcessSelector: Chargement des containers...');
      this.containers = await this.containerService.listContainers();
      
      console.log('✅ ProcessSelector: Containers chargés:', this.containers);
      
      if (this.containers.length === 0) {
        this.error = 'Aucun container disponible. Vérifiez que les projets sont bien déployés.';
      } else {
        // Sélectionner automatiquement le premier container
        this.selectedContainer = this.containers[0];
        await this.loadProcesses();
      }
      
    } catch (error: any) {
      console.error('❌ ProcessSelector: Erreur lors du chargement des containers:', error);
      this.error = 'Erreur lors du chargement des containers. Vérifiez la connexion au serveur jBPM.';
    } finally {
      this.loading = false;
    }
  }

  async loadProcesses(): Promise<void> {
    if (!this.selectedContainer) {
      this.processes = [];
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      
      console.log('🔍 ProcessSelector: Chargement des processus pour container:', this.selectedContainer['container-id']);
      
      this.processes = await this.taskService.getProcessList(this.selectedContainer['container-id']);
      
      console.log('✅ ProcessSelector: Processus chargés:', this.processes);
      
      if (this.processes.length === 0) {
        this.error = `Aucun processus disponible pour le container "${this.selectedContainer['container-id']}". Vérifiez que le projet est bien déployé.`;
      }
      
    } catch (error: any) {
      console.error('❌ ProcessSelector: Erreur lors du chargement des processus:', error);
      this.error = `Erreur lors du chargement des processus pour "${this.selectedContainer['container-id']}". Détails: ${error.message || error}`;
    } finally {
      this.loading = false;
    }
  }

  // ✅ NOUVELLE MÉTHODE POUR RAFRAÎCHIR LES DONNÉES
  async refreshData(): Promise<void> {
    console.log('🔄 ProcessSelector: Rafraîchissement des données...');
    await this.loadContainers();
  }

  selectContainer(container: Container): void {
    console.log('🔍 ProcessSelector: Container sélectionné:', container);
    this.selectedContainer = container;
    this.selectedProcess = null; // Réinitialiser la sélection de processus
    this.loadProcesses();
  }

  selectProcess(process: ProcessDefinition): void {
    console.log('🔍 ProcessSelector: Processus sélectionné:', process);
    this.selectedProcess = process;
  }

  confirmSelection(): void {
    if (this.selectedContainer && this.selectedProcess) {
      console.log('✅ ProcessSelector: Confirmation de la sélection:', {
        container: this.selectedContainer,
        process: this.selectedProcess
      });
      
      this.dialogRef.close({
        containerId: this.selectedContainer['container-id'],
        containerName: this.selectedContainer['container-alias'],
        processId: this.selectedProcess['process-id'],
        processName: this.selectedProcess['process-name'],
        processVersion: this.selectedProcess['process-version'],
        process: this.selectedProcess
      });
    }
  }

  cancel(): void {
    console.log('❌ ProcessSelector: Sélection annulée');
    this.dialogRef.close();
  }

  getProcessDisplayName(process: ProcessDefinition): string {
    return process['process-name'] || process['process-id'];
  }

  getProcessDescription(process: ProcessDefinition): string {
    const parts = [];
    if (process['process-version']) {
      parts.push(`Version: ${process['process-version']}`);
    }
    if (process['process-package']) {
      parts.push(`Package: ${process['process-package']}`);
    }
    return parts.join(' • ');
  }

  getContainerDisplayName(container: Container): string {
    return container['container-alias'] || container['container-id'];
  }
} 