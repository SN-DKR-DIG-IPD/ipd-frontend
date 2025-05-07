import { TaskNotifications } from "../../types/task-notifications";
import { Timestamp } from "../../types/timestamp";

interface INotificationAdapter {
    createEmailNotificationForATaskInstance(baseUrl: string, containerId: string, taskInstanceId: number, timeExpiration: Timestamp, bodyJSON: Object, headers: HeadersInit, whenNotCompleted?: boolean, whenNotStarted?: boolean) : Promise<number>
    getNotificationsForATaskInstance(baseUrl: string, containerId : string, taskInstanceId: number, headers: HeadersInit): Promise<TaskNotifications>
    deleteNotificationsForATaskInstance(baseUrl: string, containerId : string, taskInstanceId: number, notificationId: number, headers: HeadersInit): Promise<number>
}
export type {INotificationAdapter};