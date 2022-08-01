import clear from "rollup-plugin-clear";
import { terser } from "rollup-plugin-terser";
import ts from "rollup-plugin-ts";

/** @type {import("rollup").RollupOptions} */
const config = {
	input: "./source/index.tsx",

	external: ["react"],

	plugins: [clear({ targets: ["dist"] }), ts({ transpiler: "babel" })],

	output: [
		{ dir: "dist", format: "esm", sourcemap: true },

		{
			dir: "dist",
			entryFileNames: "[name].min.js",
			format: "esm",
			plugins: [terser()],
		},
	],
};

export default config;
