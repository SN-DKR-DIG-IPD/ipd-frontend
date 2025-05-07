import { TaskNotifications, Timestamp } from "@/types";
import { INotificationAdapter } from "../inotification-adapter";

class NotificationRestAdapter implements INotificationAdapter {
    constructor(){
    }
    async createEmailNotificationForATaskInstance(baseUrl: string, containerId: string, taskInstanceId: number, timeExpiration: Timestamp, headers: HeadersInit, bodyJSON: Object, whenNotCompleted?: boolean, whenNotStarted?: boolean): Promise<number> {
        const response = await fetch(`${baseUrl}server/admin/containers/${containerId}/tasks/${taskInstanceId}/notifications?expiresAt=${timeExpiration}${whenNotCompleted!=null?'&'+whenNotCompleted:''}${whenNotStarted!=null?'&'+whenNotStarted:''}`, {
			method: "POST",
			headers
			,
			body: JSON.stringify(
                bodyJSON
            ),
		});
        const notificationId = parseInt(await response.text());
		return notificationId;
    }

    async getNotificationsForATaskInstance(baseUrl: string, containerId: string, taskInstanceId: number, headers: HeadersInit): Promise<TaskNotifications> {
        const response = await fetch(`${baseUrl}server/admin/containers/${containerId}/tasks/${taskInstanceId}/notifications`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }

    async deleteNotificationsForATaskInstance(baseUrl: string, containerId: string, taskInstanceId: number, notificationId: number, headers: HeadersInit): Promise<number> {
        const response = await fetch(`${baseUrl}server/admin/containers/${containerId}/tasks/${taskInstanceId}/notifications/${notificationId}`, {
			method: "DELETE",
			headers
		});
        const deleteNotificationId = parseInt(await response.text());
		return deleteNotificationId;
    }
}

export { NotificationRestAdapter }