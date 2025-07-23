import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/shared/services/task.service';
import { AuthService } from 'src/app/core/service/user/auth.service';
import { UserTasks } from '@domain/types/user-tasks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox-tasks',
  templateUrl: './inbox-tasks.component.html',
  styleUrl: './inbox-tasks.component.scss'
})
export class InboxTasksComponent implements OnInit {
  tasks: any[] = [];
  isLoading = false;
  errorMsg = '';
  username: string | null = null;
  userRoles: string[] = [];
  userGroups: string[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUsername$().subscribe(username => {
      this.username = username;
      this.loadTasks();
    });
    this.authService.getRoles$().subscribe(roles => {
      this.userRoles = roles || [];
      this.loadTasks();
    });
    this.authService.getGroups$().subscribe(groups => {
      this.userGroups = groups || [];
      this.loadTasks();
    });
  }

  async loadTasks() {
    if (!this.username) return;
    this.isLoading = true;
    this.errorMsg = '';
    try {
      // Utilise la nouvelle méthode pour récupérer toutes les tâches où l'utilisateur est potential owner
      const userTasks: UserTasks = await this.taskService.getUserPotentialTasks();
      const allUserAuthorities = [...this.userRoles, ...this.userGroups];
      console.log('Groupes/roles utilisateur:', allUserAuthorities);
      console.log('Tâches reçues:', userTasks['task-summary']);
      (userTasks['task-summary'] || []).forEach((task: any) => {
        const t: any = task;
        console.log('Tâche:', t['task-name'], '| Potential owner:', t['task-potential-owner'], '| Potential group:', t['task-potential-group'], '| Actual owner:', t['task-actual-owner']);
      });
      this.tasks = (userTasks['task-summary'] || []).filter(task => {
        if (task['task-actual-owner'] === this.username) return true;
        const t: any = task;
        const potentialGroups: string[] = ((t['task-potential-owner'] as string) || (t['task-potential-group'] as string) || '').split(',').map((g: string) => g.trim()).filter(Boolean);
        return potentialGroups.some((g: string) => allUserAuthorities.includes(g));
      });
    } catch (err: any) {
      this.errorMsg = err?.message || 'Erreur lors du chargement des tâches.';
    }
    this.isLoading = false;
  }

  openTask(task: any) {
    const allUserAuthorities = [...this.userRoles, ...this.userGroups];
    const t: any = task;
    const potentialGroups: string[] = ((t['task-potential-owner'] as string) || (t['task-potential-group'] as string) || '').split(',').map((g: string) => g.trim()).filter(Boolean);
    if (
      task['task-actual-owner'] === this.username ||
      potentialGroups.some((g: string) => allUserAuthorities.includes(g))
    ) {
      this.router.navigate(['/demand/task', task['task-id'], task['task-container-id']]);
    } else {
      this.errorMsg = "Vous n'avez pas accès à cette tâche.";
    }
  }
}
