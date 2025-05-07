import { TaskNotifications } from "../../types/task-notifications";
import { Timestamp } from "../../types/timestamp";

interface INotificationAPI {
    createEmailNotificationForATaskInstance(containerId : string, taskInstanceId: number, timeExpiration: Timestamp, bodyJSON: Object, headers?: HeadersInit) : Promise<number>
    displayNotificationsForATaskInstance(containerId : string, taskInstanceId: number): Promise<TaskNotifications>
    deleteNotificationsForATaskInstance(containerId : string, taskInstanceId: number, notificationId: number): Promise<number>
}
export type {INotificationAPI};