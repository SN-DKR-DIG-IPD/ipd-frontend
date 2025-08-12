import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DemandesTachesService, TaskVM } from '../../core/services/jbpm/demandes-taches.service';
import { UserService } from '../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../demand/task-form.component';
import { BehaviorSubject, Observable, Subject, catchError, map, switchMap, takeUntil, tap, of, finalize } from 'rxjs';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTasksComponent implements OnInit, OnDestroy {
  tasks: any[] = [];
  isLoading = false;
  errorMsg = '';
  currentUser: any = null;
  data$!: Observable<any[]>;
  private reload$ = new BehaviorSubject<void>(undefined);
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: DemandesTachesService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    // Flux réactif des tâches
    this.data$ = this.reload$.pipe(
      tap(() => { this.isLoading = true; this.errorMsg = ''; }),
      switchMap(() => this.taskService.listCombined({ statuses: ['Ready','Reserved','InProgress'], pageSize: 200 }).pipe(
        map((res: TaskVM[]) => res.map(t => ({
          'task-id': t.taskId,
          'task-name': t.name,
          'task-proc-def-id': '',
          'task-container-id': t.containerId,
          'task-status': t.status,
          'task-priority': '-',
          'task-actual-owner': t.owner,
          'task-created-on': t.createdOn
        }))),
        tap(list => { this.tasks = list; }),
        catchError((error: any) => {
          this.errorMsg = 'Erreur lors du chargement des tâches : ' + (error?.message || '');
          return of([]);
        }),
        finalize(() => { this.isLoading = false; })
      ))
    );
    this.refreshTasks();
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
  // Ancienne méthode remplacée par le flux data$
  private loadUserTasks(): void { /* deprecated */ }

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
    this.reload$.next();
  }

  /**
   * Obtient le nom du formulaire correspondant au groupe de l'utilisateur
   */
  getFormNameForUserGroup(): string {
    return this.userService.getFormForUserGroup();
  }
} 