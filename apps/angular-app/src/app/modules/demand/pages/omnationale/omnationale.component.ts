import {Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProcessInstanceService } from 'src/app/shared/services/process-instance.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { ProcessSelectorComponent } from '../../../jbpm-dashboard/process-selector/process-selector.component';

@Component({
  selector: 'app-omnationale',
  templateUrl: './omnationale.component.html',
  styleUrl: './omnationale.component.scss'
})
export class OMNationaleComponent {

  currentStep: number = 1;
  maxLevel = 1;

  isLoading = false;
  errorMsg = '';
  processInstanceId?: number;
  taskId?: number;
  containerId: string = '';
  processId: string = '';
  showTaskForm = false;

  constructor(
    private processInstanceService: ProcessInstanceService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  private async ensureSelection(): Promise<boolean> {
    if (this.containerId && this.processId) return true;
    const ref = this.dialog.open(ProcessSelectorComponent, {
      width: '800px',
      data: {}
    });
    const result = await ref.afterClosed().toPromise();
    if (result && result.containerId && result.processId) {
      this.containerId = result.containerId;
      this.processId = result.processId;
      return true;
    }
    return false;
  }

  async onStartProcess() {
    this.isLoading = true;
    this.errorMsg = '';
    this.showTaskForm = false;
    try {
      // 0. Sélection dynamique du processus si non défini
      const ok = await this.ensureSelection();
      if (!ok) {
        this.errorMsg = 'Aucun processus sélectionné';
        return;
      }
      // 1. Créer une nouvelle instance de processus
      const piid = await this.processInstanceService.createOneProcessInstance(
        this.containerId,
        this.processId,
        {}, // variables initiales si besoin
      );
      this.processInstanceId = piid;
      // 2. Récupérer la première tâche utilisateur de cette instance
      const tasks = await this.taskService.getTasksForProcessInstance(piid);
      const firstTask = tasks['task-summary']?.[0];
      if (!firstTask) {
        this.errorMsg = 'Aucune tâche utilisateur trouvée pour cette instance.';
        return;
      }
      this.taskId = firstTask['task-id'];

      // 3. Lire le détail de la tâche pour obtenir le containerId canonique
      try {
        const tid = this.taskId as number;
        const detail = await this.taskService.getTaskDetails(tid, this.containerId);
        const canonical = (detail && (detail as any)['task-container-id']) || (detail as any)?.containerId;
        if (canonical) {
          this.containerId = canonical;
        }
      } catch {}

      // 4. Afficher le formulaire via <app-task-form>
      this.showTaskForm = true;
      // Écouter l'événement global pour passer à l'étape suivante après complétion
      window.addEventListener('taskFormCompleted', this.onTaskFormCompleted as EventListener);
    } catch (err: any) {
      this.errorMsg = err.message || err;
    }
    this.isLoading = false;
  }

  private onTaskFormCompleted = async () => {
    try {
      // Avancer la timeline
      this.currentStep = Math.min(this.currentStep + 1, 7);
      this.maxLevel = Math.max(this.maxLevel, this.currentStep);

      if (!this.processInstanceId || isNaN(Number(this.processInstanceId))) return;
      // Charger la prochaine tâche utilisateur de l'instance
      const piid = Number(this.processInstanceId);
      const tasks = await this.taskService.getTasksForProcessInstance(piid);
      const nextTask = tasks['task-summary']?.find((t: any) => ['Ready','Reserved','InProgress'].includes(t['task-status']));
      if (!nextTask) {
        console.log('Aucune autre tâche disponible pour cette instance');
        return;
      }
      this.taskId = nextTask['task-id'];
      // Récupérer le containerId canonique de la tâche
      try {
        const safeTid = Number(this.taskId);
        const detail = await this.taskService.getTaskDetails(safeTid, this.containerId || nextTask['task-container-id']);
        const canonical = (detail && (detail as any)['task-container-id']) || (detail as any)?.containerId;
        if (canonical) this.containerId = canonical;
      } catch {}
      this.showTaskForm = true;
    } catch (e) {
      console.warn('Erreur lors du chargement de la prochaine étape/tâche:', e);
    }
  };
}
