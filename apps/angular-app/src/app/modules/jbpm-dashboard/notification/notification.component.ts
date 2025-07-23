import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, interval } from 'rxjs';
import { TaskService } from '../../../shared/services/task.service';
import { ProcessInstanceService } from '../../../shared/services/process-instance.service';

// Interface pour les notifications
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  processInstanceId?: number;
  taskId?: number;
}

// Interface pour les paramètres de notification
interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskAssignments: boolean;
  processCompletions: boolean;
  overdueTasks: boolean;
  systemAlerts: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  // Notifications
  notifications: Notification[] = [];
  unreadCount = 0;
  
  // Settings
  settings: NotificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    taskAssignments: true,
    processCompletions: true,
    overdueTasks: true,
    systemAlerts: true
  };

  // UI State
  isLoading = false;
  showSettings = false;
  filterType: 'all' | 'unread' | 'read' = 'all';
  selectedNotificationType: 'all' | 'info' | 'success' | 'warning' | 'error' = 'all';

  // Destroy subject
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private processInstanceService: ProcessInstanceService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.startNotificationPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load notifications from API
   */
  async loadNotifications(): Promise<void> {
    try {
      this.isLoading = true;
      
      // Simuler des données pour l'instant
      // TODO: Remplacer par des appels API réels
      this.notifications = [
        {
          id: '1',
          type: 'success',
          title: 'Tâche terminée',
          message: 'La tâche "Validation RH" pour la demande OM-2024-001 a été terminée avec succès.',
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false,
          taskId: 123
        },
        {
          id: '2',
          type: 'warning',
          title: 'Tâche en retard',
          message: 'La tâche "Approbation Manager" pour la demande OM-2024-002 est en retard de 2 heures.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          taskId: 124
        },
        {
          id: '3',
          type: 'info',
          title: 'Nouvelle tâche assignée',
          message: 'Une nouvelle tâche "Validation RH" vous a été assignée pour la demande OM-2024-003.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: true,
          taskId: 125
        },
        {
          id: '4',
          type: 'error',
          title: 'Erreur de processus',
          message: 'Une erreur s\'est produite lors de l\'exécution du processus OM-2024-004.',
          timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          read: false,
          processInstanceId: 456
        },
        {
          id: '5',
          type: 'success',
          title: 'Processus terminé',
          message: 'Le processus "Demande OM Nationale" pour OM-2024-005 a été terminé avec succès.',
          timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
          read: true,
          processInstanceId: 457
        }
      ];

      this.updateUnreadCount();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Start polling for new notifications
   */
  private startNotificationPolling(): void {
    // Poll every 30 seconds for new notifications
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkForNewNotifications();
      });
  }

  /**
   * Check for new notifications
   */
  private async checkForNewNotifications(): Promise<void> {
    try {
      // TODO: Implémenter la vérification de nouvelles notifications
      // const newNotifications = await this.notificationService.getNewNotifications();
      // if (newNotifications.length > 0) {
      //   this.notifications.unshift(...newNotifications);
      //   this.updateUnreadCount();
      //   this.showNotificationToast(newNotifications[0]);
      // }
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notification: Notification): void {
    notification.read = true;
    this.updateUnreadCount();
    
    // TODO: Appel API pour marquer comme lu
    // this.notificationService.markAsRead(notification.id);
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateUnreadCount();
    
    // TODO: Appel API pour marquer toutes comme lues
    // this.notificationService.markAllAsRead();
  }

  /**
   * Delete notification
   */
  deleteNotification(notification: Notification): void {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.updateUnreadCount();
    }
    
    // TODO: Appel API pour supprimer
    // this.notificationService.deleteNotification(notification.id);
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this.notifications = [];
    this.updateUnreadCount();
    
    // TODO: Appel API pour supprimer toutes
    // this.notificationService.clearAllNotifications();
  }

  /**
   * Update unread count
   */
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  /**
   * Get filtered notifications
   */
  getFilteredNotifications(): Notification[] {
    let filtered = this.notifications;

    // Filter by read status
    if (this.filterType === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (this.filterType === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (this.selectedNotificationType !== 'all') {
      filtered = filtered.filter(n => n.type === this.selectedNotificationType);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get notification icon
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'error':
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  /**
   * Get notification color classes
   */
  getNotificationColorClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }

  /**
   * Get notification icon color
   */
  getNotificationIconColor(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  }

  /**
   * Format timestamp
   */
  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'À l\'instant';
    } else if (minutes < 60) {
      return `Il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Il y a ${hours}h`;
    } else {
      return `Il y a ${days}j`;
    }
  }

  /**
   * Navigate to notification action
   */
  navigateToAction(notification: Notification): void {
    if (notification.actionUrl) {
      // TODO: Implémenter la navigation
      console.log('Navigating to:', notification.actionUrl);
    } else if (notification.taskId) {
      // TODO: Naviguer vers la tâche
      console.log('Navigating to task:', notification.taskId);
    } else if (notification.processInstanceId) {
      // TODO: Naviguer vers l'instance de processus
      console.log('Navigating to process instance:', notification.processInstanceId);
    }
  }

  /**
   * Save notification settings
   */
  saveSettings(): void {
    // TODO: Appel API pour sauvegarder les paramètres
    // this.notificationService.updateSettings(this.settings);
    this.showSettings = false;
    console.log('Settings saved:', this.settings);
  }

  /**
   * Toggle settings panel
   */
  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  /**
   * Refresh notifications
   */
  refreshNotifications(): void {
    this.loadNotifications();
  }
}
