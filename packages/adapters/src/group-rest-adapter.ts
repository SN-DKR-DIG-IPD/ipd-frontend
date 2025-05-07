import { GroupType, IGroupAdapter } from "@jbpm/domain"

class GroupRestAdapter implements IGroupAdapter {
    constructor(){
    }
    addUserToGroup() {
        throw new Error("Method not implemented.");
    }
    removeUserFromGroup() {
        throw new Error("Method not implemented.");
    }
    async getUserGroups(baseUrl: string, username: string, headers: HeadersInit): Promise<GroupType[]> {
        const response = await fetch(`${baseUrl}users/${username}/groups`, {headers});
		const jsonResp = await response.json();
        return jsonResp;

    }

    async getAllGroups(baseUrl: string, headers: HeadersInit): Promise<GroupType[]> {
        const response = await fetch(`${baseUrl}groups`, {headers});
		const jsonResp = await response.json();
        return jsonResp;
    }
}

export { GroupRestAdapter }
