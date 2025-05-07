module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: [
		"airbnb-base",
		"airbnb-typescript/base",
		"plugin:jsdoc/recommended",
		"prettier",
	],
	plugins: ["@typescript-eslint", "jsdoc"],
	env: {
		node: true,
		jest: true,
		commonjs: true,
	},
	ignorePatterns: [".eslintrc.js", "jest.config.js"],
	rules: {
		"import/prefer-default-export": "off",
		"import/extensions": "off",
		"no-restricted-syntax": [
			"error",
			"ForInStatement",
			"LabeledStatement",
			"WithStatement",
		],
		"class-methods-use-this": "off",
	},
};
