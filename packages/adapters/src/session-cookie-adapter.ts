import { ISessionAdapter } from "@jbpm/domain";

class SessionCookieAdapter implements ISessionAdapter {
	storeValue(key: string, value: string, duration: number): void {
		document.cookie = `${key}=${value}; path=/; max-age=${duration}; SameSite=Strict`;
	}

	getValue(key: string): string {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${key}=`);
		return parts.pop()?.split(";").shift() as string;
	}

	flush(): void {
		const cookies = document.cookie.split(";");

		for (const cookie of cookies) {
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		}
	}
}

export { SessionCookieAdapter };
