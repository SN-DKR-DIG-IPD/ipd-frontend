import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { UserService } from '../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../demand/task-form.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss']
})
export class UserTasksComponent implements OnInit, OnDestroy {
  tasks: any[] = [];
  isLoading = false;
  errorMsg = '';
  currentUser: any = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadUserTasks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les informations de l'utilisateur connecté
   */
  private loadUserInfo(): void {
    this.currentUser = this.userService.getCurrentUser();
    console.log('Utilisateur connecté:', this.currentUser);
  }

  /**
   * Charge les tâches de l'utilisateur filtrées selon son groupe
   */
  async loadUserTasks(): Promise<void> {
    this.isLoading = true;
    this.errorMsg = '';
    
    try {
      // Utiliser la méthode qui filtre automatiquement selon le groupe
      const result = await this.taskService.getUserTasks();
      this.tasks = result['task-summary'] || [];
      
      console.log('Tâches filtrées selon le groupe:', this.tasks);
    } catch (error: any) {
      this.errorMsg = 'Erreur lors du chargement des tâches : ' + (error.message || error);
      console.error('Erreur loadUserTasks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Ouvre le formulaire de tâche
   */
  openTaskForm(task: any): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '800px',
      data: {
        taskId: task['task-id'],
        containerId: task['task-container-id'],
        taskName: task['task-name']
      }
    });

    dialogRef.componentInstance.taskId = task['task-id'];
    dialogRef.componentInstance.containerId = task['task-container-id'];

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'completed') {
          this.loadUserTasks(); // Recharger les tâches
        }
      });
  }

  /**
   * Obtient la classe CSS pour le statut de la tâche
   */
  getTaskStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Ready': 'bg-yellow-100 text-yellow-800',
      'Reserved': 'bg-blue-100 text-blue-800',
      'InProgress': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Failed': 'bg-red-100 text-red-800',
      'Error': 'bg-red-100 text-red-800',
      'Exited': 'bg-gray-100 text-gray-800',
      'Obsolete': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(date: any): string {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR');
  }

  /**
   * Rafraîchit la liste des tâches
   */
  refreshTasks(): void {
    this.loadUserTasks();
  }

  /**
   * Obtient le nom du formulaire correspondant au groupe de l'utilisateur
   */
  getFormNameForUserGroup(): string {
    return this.userService.getFormForUserGroup();
  }
} 