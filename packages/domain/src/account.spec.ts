import { describe, test, beforeAll, expect } from "vitest";
import { Account } from "./account";
import { AuthenticationInMemAdapter } from "./ports/spi/stubs/authentication-inmem-adapter";
import { SessionInMemAdapter } from "./ports/spi/stubs/session-inmem-adapter";
import { IDefaultConfigAdapter } from "./ports/spi";
import { IDefaultConfigAPI } from "./ports/api";
import { DefaultConfig } from "./default-config";
import { DefaultConfigAdapter } from "./ports/spi/stubs/default-config-adapter";

describe("Account domain service", () => {
	let defaultConfigAdapter: IDefaultConfigAdapter;
	let defaultConfig: IDefaultConfigAPI;
	let account: Account;
	beforeAll(() => {
		defaultConfigAdapter = new DefaultConfigAdapter();
		defaultConfig = new DefaultConfig(defaultConfigAdapter);
			account = new Account(
			defaultConfig,
			new AuthenticationInMemAdapter(),
			new SessionInMemAdapter()
		);
	});

	test("should register a new user", async () => {
		const ack = await account.register("doe-j", "secret");
		expect(ack).toEqual({
			username: "doe-j",
			status: "CREATED",
		});
	});

	test("should throw an error on register with an empty user", async () => {
		await expect(account.register("", "man")).rejects.toThrow(
			"Username could not be empty"
		);
	});

	test("should throw an error on register with an empty password", async () => {
		await expect(account.register("invisible", "")).rejects.toThrow(
			"Password could not be empty"
		);
	});

	test("should return an errored ack on register an existing user", async () => {
		const ack = await account.register("doe-j", "secret");
		expect(ack).toEqual({
			username: "doe-j",
			status: "ERROR",
		});
	});

	test("should store an auth token on signin with a valid username and password", async () => {
		expect(account.isAuthenticated()).toBeFalsy();
		const tokenResp = await account.authenticate("doe-j", "secret");
		const token = account.getToken();
		expect(tokenResp).toBe("ZG9lLWo6c2VjcmV0");
		expect(token).toBe("ZG9lLWo6c2VjcmV0");

		const username = account.getUsername();
		expect(username).toBe("doe-j");
		expect(account.isAuthenticated()).toBeTruthy();
	});

	test("should throw an error on signin with an unexisting user", async () => {
		await expect(account.authenticate("invisible", "man")).rejects.toThrow(
			"Something went wrong during the authentication. Check your username and password."
		);
	});

	test("should throw an error on signin with an invalid password", async () => {
		await expect(account.authenticate("invisible", "man")).rejects.toThrow(
			"Something went wrong during the authentication. Check your username and password."
		);
	});

	test("should throw an error on signin with an empty user", async () => {
		await expect(account.authenticate("", "man")).rejects.toThrow(
			"Username could not be empty"
		);
	});

	test("should throw an error on signin with an empty password", async () => {
		await expect(account.authenticate("invisible", "")).rejects.toThrow(
			"Password could not be empty"
		);
	});

	test("should flush user session on logout", async () => {
		await account.logout();
		expect(account.isAuthenticated()).toBeFalsy();
	});

	test("should have error while getting username on logout state", async () => {
		await account.authenticate("doe-j", "secret");
		await account.logout();
		expect(() => account.getUsername()).toThrow("Token not found");
	});
});
