import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProcessInstanceService } from '../../../shared/services/process-instance.service';
import { TaskService } from '../../../shared/services/task.service';

// Interface pour les statistiques
interface ProcessStats {
  total: number;
  completed: number;
  inProgress: number;
  failed: number;
  avgCompletionTime: number;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  avgTaskTime: number;
}

interface MonthlyStats {
  month: string;
  processes: number;
  tasks: number;
  completionRate: number;
}

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss'
})
export class ReportingComponent implements OnInit, OnDestroy {
  // Loading states
  isLoading = false;
  isLoadingStats = false;
  isLoadingCharts = false;

  // Data
  processStats: ProcessStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    failed: 0,
    avgCompletionTime: 0
  };

  taskStats: TaskStats = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    avgTaskTime: 0
  };

  monthlyStats: MonthlyStats[] = [];
  topProcesses: any[] = [];
  topUsers: any[] = [];

  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Math object for template access
  Math = Math;

  // Date range
  dateRange = '30'; // days
  selectedContainer = '';

  // Destroy subject
  private destroy$ = new Subject<void>();

  constructor(
    private processInstanceService: ProcessInstanceService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadReportingData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all reporting data
   */
  async loadReportingData(): Promise<void> {
    try {
      this.isLoading = true;
      await Promise.all([
        this.loadProcessStatistics(),
        this.loadTaskStatistics(),
        this.loadMonthlyTrends(),
        this.loadTopPerformers()
      ]);
    } catch (error) {
      console.error('Error loading reporting data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load process statistics
   */
  async loadProcessStatistics(): Promise<void> {
    try {
      this.isLoadingStats = true;
      
      // Simuler des données pour l'instant
      // TODO: Remplacer par des appels API réels
      this.processStats = {
        total: 1250,
        completed: 980,
        inProgress: 220,
        failed: 50,
        avgCompletionTime: 3.5
      };
    } catch (error) {
      console.error('Error loading process statistics:', error);
    } finally {
      this.isLoadingStats = false;
    }
  }

  /**
   * Load task statistics
   */
  async loadTaskStatistics(): Promise<void> {
    try {
      this.isLoadingStats = true;
      
      // Simuler des données pour l'instant
      // TODO: Remplacer par des appels API réels
      this.taskStats = {
        total: 3450,
        completed: 2800,
        pending: 450,
        overdue: 200,
        avgTaskTime: 2.1
      };
    } catch (error) {
      console.error('Error loading task statistics:', error);
    } finally {
      this.isLoadingStats = false;
    }
  }

  /**
   * Load monthly trends
   */
  async loadMonthlyTrends(): Promise<void> {
    try {
      this.isLoadingCharts = true;
      
      // Simuler des données pour l'instant
      // TODO: Remplacer par des appels API réels
      this.monthlyStats = [
        { month: 'Jan', processes: 120, tasks: 350, completionRate: 85 },
        { month: 'Fév', processes: 135, tasks: 380, completionRate: 88 },
        { month: 'Mar', processes: 150, tasks: 420, completionRate: 92 },
        { month: 'Avr', processes: 140, tasks: 390, completionRate: 87 },
        { month: 'Mai', processes: 160, tasks: 450, completionRate: 90 },
        { month: 'Juin', processes: 175, tasks: 480, completionRate: 93 }
      ];
    } catch (error) {
      console.error('Error loading monthly trends:', error);
    } finally {
      this.isLoadingCharts = false;
    }
  }

  /**
   * Load top performers
   */
  async loadTopPerformers(): Promise<void> {
    try {
      // Simuler des données pour l'instant
      // TODO: Remplacer par des appels API réels
      this.topProcesses = [
        { name: 'Demande OM Nationale', count: 450, successRate: 95 },
        { name: 'Demande OM Internationale', count: 320, successRate: 92 },
        { name: 'Validation RH', count: 280, successRate: 88 },
        { name: 'Approbation Manager', count: 200, successRate: 85 }
      ];

      this.topUsers = [
        { name: 'Jean Dupont', tasks: 45, avgTime: 1.8 },
        { name: 'Marie Martin', tasks: 42, avgTime: 2.1 },
        { name: 'Pierre Durand', tasks: 38, avgTime: 2.3 },
        { name: 'Sophie Bernard', tasks: 35, avgTime: 1.9 }
      ];
    } catch (error) {
      console.error('Error loading top performers:', error);
    }
  }

  /**
   * Export report to PDF
   */
  exportToPDF(): void {
    // TODO: Implémenter l'export PDF
    console.log('Exporting to PDF...');
  }

  /**
   * Export report to Excel
   */
  exportToExcel(): void {
    // TODO: Implémenter l'export Excel
    console.log('Exporting to Excel...');
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.loadReportingData();
  }

  /**
   * Calculate completion rate
   */
  getCompletionRate(): number {
    if (this.processStats.total === 0) return 0;
    return Math.round((this.processStats.completed / this.processStats.total) * 100);
  }

  /**
   * Calculate task completion rate
   */
  getTaskCompletionRate(): number {
    if (this.taskStats.total === 0) return 0;
    return Math.round((this.taskStats.completed / this.taskStats.total) * 100);
  }

  /**
   * Get status class for process stats
   */
  getProcessStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'inProgress':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Get status class for task stats
   */
  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Format time in hours
   */
  formatTime(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    return `${hours.toFixed(1)}h`;
  }

  /**
   * Get chart data for monthly trends
   */
  getMonthlyChartData(): any {
    return {
      labels: this.monthlyStats.map(stat => stat.month),
      datasets: [
        {
          label: 'Processus',
          data: this.monthlyStats.map(stat => stat.processes),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Tâches',
          data: this.monthlyStats.map(stat => stat.tasks),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    };
  }

  /**
   * Get chart data for completion rates
   */
  getCompletionRateChartData(): any {
    return {
      labels: this.monthlyStats.map(stat => stat.month),
      datasets: [
        {
          label: 'Taux de complétion (%)',
          data: this.monthlyStats.map(stat => stat.completionRate),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4
        }
      ]
    };
  }
}
