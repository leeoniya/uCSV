const fs = require('fs');

// function cssmin(css) {
// 	return css
// 		.replace(/\s{1,}/g, ' ')
// 		.replace(/\{\s{1,}/g,"{")
// 		.replace(/\}\s{1,}/g,"}")
// 		.replace(/\;\s{1,}/g,";")
// 		.replace(/\/\*\s{1,}/g,"/*")
// 		.replace(/\*\/\s{1,}/g,"*/");
// }

// let minicss = cssmin(fs.readFileSync('./src/uDSV.css', 'utf8'));
// fs.writeFileSync('./dist/uDSV.min.css', minicss);

import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const ver = "v" + pkg.version;
const urlVer = "https://github.com/leeoniya/uDSV (" + ver + ")";
const banner = [
	"/**",
	"* Copyright (c) " + new Date().getFullYear() + ", Leon Sorokin",
	"* All rights reserved. (MIT Licensed)",
	"*",
	"* uDSV.js",
	"* A small, fast CSV parser",
	"* " + urlVer,
	"*/",
	"",
].join("\n");

function bannerlessESM() {
	return {
		name: 'stripBanner',
		resolveId(importee) {
			if (importee == 'uDSV')
				return importee;
			return null;
		},
		load(id) {
			if (id == 'uDSV')
				return fs.readFileSync('./dist/uDSV.esm.js', 'utf8').replace(/\/\*\*.*?\*\//gms, '');
			return null;
		}
	};
}

const terserOpts = {
	compress: {
		inline: 0,
		passes: 2,
		keep_fargs: false,
		pure_getters: true,
		unsafe: true,
		unsafe_comps: true,
		unsafe_math: true,
		unsafe_undefined: true,
	},
	output: {
		comments: /^!/
	}
};

export default [
	{
		input: './src/uDSV.js',
		output: {
			name: 'uDSV',
			file: './dist/uDSV.esm.js',
			format: 'es',
			banner,
		},
	},
	{
		input: './src/uDSV.js',
		output: {
			name: 'uDSV',
			file: './dist/uDSV.cjs.js',
			format: 'cjs',
			exports: "auto",
			banner,
		},
	},
	{
		input: 'uDSV',
		output: {
			name: 'uDSV',
			file: './dist/uDSV.iife.js',
			format: 'iife',
			esModule: false,
			banner,
		},
		plugins: [
			bannerlessESM(),
		]
	},
	{
		input: 'uDSV',
		output: {
			name: 'uDSV',
			file: './dist/uDSV.iife.min.js',
			format: 'iife',
			esModule: false,
			banner: "/*! " + urlVer + " */",
		},
		plugins: [
			bannerlessESM(),
			terser(terserOpts),
		]
	},
];