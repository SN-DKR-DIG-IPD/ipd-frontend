import { IRole } from './role.model';

export interface IUser {
  userId: number
  photo: '';
  userFirstName: string;
  userLastName: string;
  username: string;
  userEmailAddress: string;
  role: IRole;
}
