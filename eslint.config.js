import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
	{
		ignores: [
			"dist/**",
			"node_modules/**",
			"coverage/**",
			"prisma/generated/**",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			// Match previous Biome settings
			"@typescript-eslint/no-explicit-any": "warn",
			"no-cond-assign": "off",
			// Allow short-circuit / nullish side-effect patterns used in the codebase
			"@typescript-eslint/no-unused-expressions": [
				"error",
				{
					allowShortCircuit: true,
					allowTernary: true,
				},
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
		},
	},
)
