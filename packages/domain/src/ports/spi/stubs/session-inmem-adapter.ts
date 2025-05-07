import { ISessionAdapter } from "../isession-adapter";

class SessionInMemAdapter implements ISessionAdapter {
	store:{[key: string]:any};

	constructor() {
		this.store = {};
	}

	storeValue(key: string, value: string, duration: number): void {
		console.log(duration);
		this.store[key] = value;
	}

	getValue(key: string): string {
		return this.store[key];
	}

	flush(): void {
		this.store = {};
	}
}

export { SessionInMemAdapter };
