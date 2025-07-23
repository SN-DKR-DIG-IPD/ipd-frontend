import { Component, OnInit } from '@angular/core';
import { ProcessInstanceService } from '../../../shared/services/process-instance.service';
import { ContainerService } from '../../../shared/services/container.service';

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

  constructor(
    private processInstanceService: ProcessInstanceService,
    private containerService: ContainerService
  ) {}

  async ngOnInit() {
    await this.reload();
  }

  async reload() {
    if (this.isLoading) return; // Empêche les rechargements multiples
    this.isLoading = true;
    this.errorMsg = '';
    this.rows = [];
    this.typeOMList = [];
    try {
      const defaultHeader = JSON.parse(sessionStorage.getItem('defaultHeader')!);
      const containersResult = await this.containerService.listContainers();
      this.containers = containersResult || [];
      // Chargement des instances de tous les containers en parallèle
      const allInstances = await Promise.all(containersResult.map(async (container: any) => {
        const containerId = container['container-id'];
        const instancesResult = await this.processInstanceService.getAllProcessInstances(containerId, defaultHeader);
        const instances = instancesResult['process-instance'] || [];
        // Chargement des variables de toutes les instances en parallèle
        const instanceRows = await Promise.all(instances.map(async (instance: any) => {
          try {
            const variables = await this.processInstanceService.getProcessInstanceVariables(containerId, instance['process-instance-id'], defaultHeader);
            const instanceData = instance as any;
            // DEBUG : log des variables et de l'instance pour comprendre pourquoi date de fin est absente
            console.log('Instance ID:', instance['process-instance-id']);
            console.log('variables:', variables);
            console.log('instanceData:', instanceData);
            const dateDebut = variables['dateDebut'] || instanceData['start-date'] || '';
            const dateFin = variables['dateFin'] || instanceData['end-date'] || '';
            const approbateur = variables['approbateur'] || variables['approbation'] || instanceData['initiator'] || '';
            const roleApprobateur = variables['roleApprobateur'] || variables['role_approbateur'] || '';
            const taux = variables['tauxCompletu'] || instanceData['tauxCompletu'] || 0;
            const typeOM = variables['typeOM'] || instance['process-name'] || '';
            if (!this.rows.some(r => r.id === instance['process-instance-id'])) {
              const row = {
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

  applyFilters() {
    this.filteredRows = this.rows.filter(row => {
      const refMatch = !this.filters.reference || row.id.toString().includes(this.filters.reference);
      const typeMatch = !this.filters.typeOM || row.type === this.filters.typeOM;
      const dateMatch = !this.filters.dateDebut || (row.dateDebut && row.dateDebut.startsWith(this.filters.dateDebut));
      const statutMatch = !this.filters.statut || row.statut === this.filters.statut;
      return refMatch && typeMatch && dateMatch && statutMatch;
    });
  }
} 