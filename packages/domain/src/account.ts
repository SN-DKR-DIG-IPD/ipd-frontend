import { IAccountAPI, IDefaultConfigAPI } from "./ports/api";
import { Registration } from "./types/registration";
import { IAuthenticationAdapter } from "./ports/spi/iauthentication-adapter";
import { ISessionAdapter } from "./ports/spi/isession-adapter";

class Account implements IAccountAPI {
	private defaultConfig: IDefaultConfigAPI;
	private authAdapter: IAuthenticationAdapter;

	private sessionAdapter: ISessionAdapter;

	private defaultSessionDuration: number;

	constructor(
		defaultConfig: IDefaultConfigAPI,
		authAdapter: IAuthenticationAdapter,
		sessionAdapter: ISessionAdapter
	) {
		this.defaultConfig = defaultConfig;
		this.authAdapter = authAdapter;
		this.sessionAdapter = sessionAdapter;
		this.defaultSessionDuration = 120;
	}

	async authenticate(username: string, password: string): Promise<string> {
		this.checkThatUserIsFilled(username);
		this.checkThatPasswordIsFilled(password);

		try {
			const token = await this.authAdapter.auth(username, password, this.defaultConfig.getAPIBaseUrl(), { 
			Authorization: 'Basic ' +btoa(`${username}:${password}`),
			Accept: 'application/json',
			'Content-Type': 'application/json;charset=UTF-8'
		 });

			this.sessionAdapter.storeValue(
				"auth-token",
				token,
				this.defaultSessionDuration
			);

			return token;
		} catch (error) {
			throw new Error(
				"Something went wrong during the authentication. Check your username and password."
			);
		}
	}

	async register(username: string, password: string): Promise<Registration> {
		this.checkThatUserIsFilled(username);
		this.checkThatPasswordIsFilled(password);

		try {
			await this.authAdapter.register(username, password);
			return {
				username,
				status: "CREATED",
			};
		} catch (error) {
			return {
				username,
				status: "ERROR",
			};
		}
	}

	async logout(): Promise<void> {
		this.sessionAdapter.flush();
	}

	getToken(): string {
		const token = this.sessionAdapter.getValue("auth-token");
		if (!token) {
			throw new Error("Token not found");
		}

		return token;
	}

	getUsername(): string {
		const token = this.getToken();
		const [user] = atob(token).split(":");
		if (!user) {
			throw new Error("Invalid token format");
		}
		return user;
	}

	isAuthenticated(): boolean {
		try {
			const token = this.getToken();
			if (token.length) {
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	}

	checkThatUserIsFilled(username: string) {
		if (!username.length) {
			throw new Error("Username could not be empty");
		}
	}

	checkThatPasswordIsFilled(password: string) {
		if (!password.length) {
			throw new Error("Password could not be empty");
		}
	}
}

export { Account };
