import { IRole } from './role.model';

export interface IUser {
  userId?: number;
  userCreationDate?: string;
  userModificationDate?: string;
  userKeycloakId?: string;
  username: string;
  userLastName: string;
  userFirstName: string;
  userEmailAddress: string;
  userLocale?: string;
  role?: IRole;
  permissions?: string[];
}
