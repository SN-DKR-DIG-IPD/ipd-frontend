import {Component} from '@angular/core';
import { ProcessInstanceService } from 'src/app/shared/services/process-instance.service';
import { TaskService } from 'src/app/shared/services/task.service';

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
  containerId: string = 'MissionOM_1.0.0-SNAPSHOT'; // À adapter si besoin
  processId: string = 'SP_ValidationChefService'; // À adapter si besoin
  showTaskForm = false;

  constructor(
    private processInstanceService: ProcessInstanceService,
    private taskService: TaskService
  ) {}

  async onStartProcess() {
    this.isLoading = true;
    this.errorMsg = '';
    this.showTaskForm = false;
    try {
      // 1. Créer une nouvelle instance de processus
      this.processInstanceId = await this.processInstanceService.createOneProcessInstance(
        this.containerId,
        this.processId,
        {}, // variables initiales si besoin
      );
      // 2. Récupérer la première tâche utilisateur de cette instance
      const tasks = await this.taskService.getTasksForProcessInstance(this.processInstanceId);
      const firstTask = tasks['task-summary']?.[0];
      if (!firstTask) {
        this.errorMsg = 'Aucune tâche utilisateur trouvée pour cette instance.';
        return;
      }
      this.taskId = firstTask['task-id'];
      this.showTaskForm = true;
    } catch (err: any) {
      this.errorMsg = err.message || err;
    }
    this.isLoading = false;
  }
}
