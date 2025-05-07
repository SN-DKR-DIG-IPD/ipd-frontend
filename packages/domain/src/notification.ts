import { IDefaultConfigAPI, INotificationAPI } from "./ports/api";
import { INotificationAdapter } from "./ports/spi";
import { TaskNotifications, Timestamp } from "./types";

class Notification implements INotificationAPI {
	defaultConfig: IDefaultConfigAPI
	notificationAdapter: INotificationAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		notificationAdapter: INotificationAdapter
	) {
		this.defaultConfig = defaultConfig
		this.notificationAdapter = notificationAdapter;
	}
	async createEmailNotificationForATaskInstance(containerId: string, taskInstanceId: number, timeExpiration: Timestamp, bodyJSON, headers = this.defaultConfig.getDefaultHeaders()): Promise<number> {
		return this.notificationAdapter.createEmailNotificationForATaskInstance(this.defaultConfig.getAPIBaseUrl(), containerId, taskInstanceId, timeExpiration, bodyJSON, headers)
	}
	async displayNotificationsForATaskInstance(containerId: string, taskInstanceId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<TaskNotifications> {
		return this.notificationAdapter.getNotificationsForATaskInstance(this.defaultConfig.getAPIBaseUrl(), containerId, taskInstanceId, headers)
	}
	async deleteNotificationsForATaskInstance(containerId: string, taskInstanceId: number, notificationId: number, headers = this.defaultConfig.getDefaultHeaders()): Promise<number> {
		return this.notificationAdapter.deleteNotificationsForATaskInstance(this.defaultConfig.getAPIBaseUrl(), containerId, taskInstanceId, notificationId, headers)
	}
}

export { Notification };
