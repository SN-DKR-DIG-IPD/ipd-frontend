// Karma configuration file, see link for more information-
// https://karma-runner.github.io/0.13/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-coverage"),
      require("karma-chrome-launcher"),
      require("karma-sonarqube-unit-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false,
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
    coverageReporter: {
      dir: "./reports",
      reporters: [{ type: "lcovonly", subdir: "./" }],
    },
    sonarQubeUnitReporter: {
      outputFile: "reports/results.xml",
      sonarQubeVersion: "LATEST",
      useBrowserName: false,
      testFilePattern: ".spec.ts",
      overrideTestDescription: true,
    },
    reporters: ["sonarqubeUnit", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ["ChromeHeadless"],
    singleRun: true,
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: ["--headless", "--disable-gpu", "--remote-debugging-port=9222"],
      },
    },
  });
};
