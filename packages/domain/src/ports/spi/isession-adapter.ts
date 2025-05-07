interface ISessionAdapter {
	storeValue(key: string, value: string, duration: number): void;
	getValue(key: string): string;
	flush(): void;
}

export type { ISessionAdapter };