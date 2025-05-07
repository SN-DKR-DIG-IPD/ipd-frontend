import { IPermission } from "./permission.model";

export interface IRole {
  roleId?: number;
  name?: string;
  description?: string;
  externalReference?: any;
  creationDate?: string;
  modificationDate?: string | null;
  permissions?: IPermission[];
}
