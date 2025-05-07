import { Registration } from "../../types/registration";

interface IAuthenticationAdapter{
	auth(username: string, password: string, baseUrl?: string, headers?: HeadersInit): Promise<string>;
	register(username: string, password: string): Promise<Registration>|Promise<void>; // Promise<Registration>|
}

export type { IAuthenticationAdapter };