import { IAuthenticationAdapter, Registration } from "@jbpm/domain";
   

class AuthenticationRestAdapter implements IAuthenticationAdapter {
	users;

	constructor() {
	}

	async auth(username: string, password: string, baseUrl?: string, headers?: HeadersInit): Promise<string> {
        const response = await fetch(`${baseUrl}server/containers`, {headers});
		if (response.status === 401) {
			throw new Error("Bad credentials");
		}
		return btoa(`${username}:${password}`);
	}

	async register(username: string, password: string): Promise<Registration> {
		const found = this.users.find((user) => user.username === username);
		if (found) {
			throw new Error("User already exists");
		}
		this.users.push({
			username,
			password,
		});
		return new Promise((resolve, reject)=>{
			resolve({
			username,
			status: "CREATED"
			})
		})
	}
}

export { AuthenticationRestAdapter };
