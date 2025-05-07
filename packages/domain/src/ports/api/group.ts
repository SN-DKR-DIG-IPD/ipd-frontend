import { GroupType } from "@/types";

interface IGroupAPI {
    addUserToGroup(headers?: HeadersInit): any
    removeUserFromGroup(headers?: HeadersInit): any
    listUserGroups(username: string, headers?: HeadersInit): Promise<GroupType[]>
    listAllGroups(headers?: HeadersInit): Promise<GroupType[]>
}
export type {IGroupAPI};