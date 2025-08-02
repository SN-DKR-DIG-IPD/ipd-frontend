import { IPermission } from "./permission.model";

export interface IRole {
  roleId: number;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}
