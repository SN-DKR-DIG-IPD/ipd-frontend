import { GroupType } from "@/types";

interface IGroupAdapter {
    addUserToGroup(baseUrl: string, headers: HeadersInit): any
    removeUserFromGroup(baseUrl: string, headers: HeadersInit): any
    getUserGroups(baseUrl: string,username: string, headers: HeadersInit): Promise<GroupType[]>;
    getAllGroups(baseUrl: string, headers: HeadersInit): Promise<GroupType[]>;
}
export type {IGroupAdapter};