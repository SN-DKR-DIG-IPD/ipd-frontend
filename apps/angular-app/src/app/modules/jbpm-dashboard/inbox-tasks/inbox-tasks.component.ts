import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TaskService } from 'src/app/shared/services/task.service';
import { AuthService } from 'src/app/core/service/user/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-inbox-tasks',
  templateUrl: './inbox-tasks.component.html',
  styleUrls: ['./inbox-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxTasksComponent implements OnInit {
  tasks: any[] = [];
  isLoading = false;
  errorMsg = '';
  username: string | null = null;
  userRoles: string[] = [];
  userGroups: string[] = [];
  data$!: Observable<any[]>;
  private reload$ = new BehaviorSubject<void>(undefined);

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Flux de données pour les tâches basé sur reload$
    this.data$ = this.reload$.pipe(
      switchMap(() => {
        if (!this.username) return of([]);
        this.isLoading = true;
        this.errorMsg = '';
        return this.taskService
          .getUserTasks({ statuses: ['Ready', 'Reserved', 'InProgress'], pageSize: 50 })
          .pipe(
            map((res: any) => (res && res['task-summary']) ? res['task-summary'] : (res || [])),
            tap(() => (this.isLoading = false)),
            catchError((err) => {
              this.errorMsg = err?.message || 'Erreur lors du chargement des tâches.';
              this.isLoading = false;
              return of([]);
            })
          );
      })
    );

    this.authService.getUsername$().subscribe(username => {
      this.username = username;
      this.refresh();
    });
    this.authService.getRoles$().subscribe(roles => {
      this.userRoles = roles || [];
      this.refresh();
    });
    this.authService.getGroups$().subscribe(groups => {
      this.userGroups = groups || [];
      this.refresh();
    });
  }

  refresh(): void {
    if (!this.username) return;
    this.reload$.next();
  }

  async openTask(task: any) {
    try {
      // Récupérer les métadonnées et variables pour alimenter la modale Detail
      const taskId = Number(task['task-id']);
      const containerId = String(task['task-container-id']);
      // Détails + variables d'entrée
      const details = await this.taskService.getTaskDetails(taskId, containerId);
      const inputVars = await this.taskService.getTaskInputVariables(taskId, containerId);
      // Naviguer vers la modale existante (comportement actuel) via route dédiée si présente
      // Sinon, réutiliser le flux actuel (selon votre app) → ici navigation vers la page existante
      this.router.navigate(['/demand/task', taskId, containerId], {
        state: {
          taskDetails: details,
          inputVariables: inputVars
        }
      });
    } catch (e: any) {
      this.errorMsg = e?.message || "Erreur lors de l'ouverture de la tâche.";
    }
  }
}
