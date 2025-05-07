import { Registration } from "../../types/registration";

interface IAccountAPI {
	authenticate(username: string, password: string): Promise<string>;
	isAuthenticated(): boolean;
	logout(): Promise<void>;
	register(username: string, password: string): Promise<Registration>;
	getToken(): string;
	getUsername(): string;
}

export type { IAccountAPI };