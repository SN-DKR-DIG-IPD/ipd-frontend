import { describe, test, beforeAll, expect, vi, afterAll } from "vitest";
import { Account } from "./account";
import { DefaultConfig } from "./default-config";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { NotificationRestAdapter } from "./ports/spi/stubs/notification-rest-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";
import { IDefaultConfigAPI } from "./ports/api";
import { Notification } from "./notification";

describe("Notification domain service", () => {

	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	let notification: Notification;
	const consoleSpy = vi.spyOn(console, 'log')
	const containerId = ''
	const taskInstanceId = 67
	const notificationId = 67
	const timeExpiration = 1724771385
	const bodyJSON = {
					  "from" : "test@jbpm.org",
					  "reply-to" : "no-reply@jbpm.org",
					  "users" : [ "john" ],
					  "groups" : null,
					  "subject" : "reminder",
					  "body" : "my test content"
					}


	beforeAll(() => {
		defaultConfigAdapter = new DefaultConfigAdapter();
		defaultConfig = new DefaultConfig(defaultConfigAdapter);
		defaultConfig.setAPIBaseUrl('http://localhost:8080/kie-server/services/rest/')
		account = new Account(
				defaultConfig,
				new AuthenticationInMemAdapter(),
				new SessionInMemAdapter()
			);

		(async()=> {
			await account.authenticate('wbadmin', 'wbadmin')
			defaultConfig.setDefaultHeaders({ 
				Authorization: 'Basic ' + account.getToken(),
				Accept: 'application/json',
				'Content-Type': 'application/json'
			 })
		})()


		notification = new Notification(
			defaultConfig,
			new NotificationRestAdapter()
		);
	});

	test("should create email notification for a task instance", async () => {
		const notificationResponseId = await notification.createEmailNotificationForATaskInstance(containerId, taskInstanceId, timeExpiration, bodyJSON);
		console.log('notification response id: ', notificationResponseId);
    	expect(consoleSpy).toHaveBeenLastCalledWith('notification response id: ', notificationResponseId);
		expect(notificationResponseId).not.toBeNull();
	});

	test("should display notifications for a task instance", async () => {
		const taskInstanceNotifications = await notification.displayNotificationsForATaskInstance(containerId, taskInstanceId);
		console.log('task instance notifications: ', taskInstanceNotifications);
    	expect(consoleSpy).toHaveBeenLastCalledWith('task instance notifications: ', taskInstanceNotifications);
		expect(taskInstanceNotifications).not.toBeNull();
	});

	test("should delete notification for a task instance", async () => {
		const connectedUserTasks = await notification.deleteNotificationsForATaskInstance(containerId, taskInstanceId, notificationId)
		expect(connectedUserTasks).not.toBeNull();
	});

	afterAll(() => {
		account.logout()
	})
});

