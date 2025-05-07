import { IDefaultConfigAPI, IGroupAPI } from "./ports/api";
import { IGroupAdapter } from "./ports/spi";
import { GroupType } from "./types";

class Group implements IGroupAPI {
	defaultConfig: IDefaultConfigAPI
	groupAdapter: IGroupAdapter;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		groupAdapter: IGroupAdapter,
	) {
		this.defaultConfig = defaultConfig
		this.groupAdapter = groupAdapter;
	}

	addUserToGroup() {
		throw new Error("Method not implemented.");
	}

	removeUserFromGroup() {
		throw new Error("Method not implemented.");
	}

	listUserGroups(username: string, headers = this.defaultConfig.getDefaultHeaders()): Promise<GroupType[]> {
		return this.groupAdapter.getUserGroups(this.defaultConfig.getBusinessCentralAPIBaseUrl(), username, headers)
	}
	listAllGroups(headers = this.defaultConfig.getDefaultHeaders()): Promise<GroupType[]> {
		return this.groupAdapter.getAllGroups(this.defaultConfig.getBusinessCentralAPIBaseUrl(), headers)
	}
}

export { Group };
