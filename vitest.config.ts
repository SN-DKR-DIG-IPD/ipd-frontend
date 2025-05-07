import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["packages/{adapters,domain}/**/*.{spec,test}.ts"],
		reporters: ["default", "junit"],
		outputFile: "./coverage/junit.xml",
		coverage: {
			reporter: ["html", "text", "lcov"],
		},
	},
});
