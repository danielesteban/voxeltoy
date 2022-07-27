import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const outputPath = path.resolve(__dirname, 'dist');
const production = !process.env.ROLLUP_WATCH;
const server = production ? 'https://voxeltoy-server.gatunes.com/' : 'http://localhost:8081/';
const token = production ? (
  'AjvbB3Z6EZse+QrdlEIEtxDjjfJirkH1YL4yS+dZiaTGFx0TlVdb1mhzgR7fQeFuKrOwEKCoPb6GjNbSdStxpwQAAABUeyJvcmlnaW4iOiJodHRwczovL3ZveGVsdG95LmdhdHVuZXMuY29tOjQ0MyIsImZlYXR1cmUiOiJXZWJHUFUiLCJleHBpcnkiOjE2NzUyMDk1OTl9'
) : (
  'AvyDIV+RJoYs8fn3W6kIrBhWw0te0klraoz04mw/nPb8VTus3w5HCdy+vXqsSzomIH745CT6B5j1naHgWqt/tw8AAABJeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJmZWF0dXJlIjoiV2ViR1BVIiwiZXhwaXJ5IjoxNjYzNzE4Mzk5fQ=='
);

export default {
  input: path.join(__dirname, 'src', 'main.js'),
  output: {
    dir: outputPath,
    format: 'iife',
  },
  plugins: [
    copy({
      targets: [{ src: 'screenshot.png', dest: 'dist' }],
    }),
    html({
      template: () => (
        fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8')
          .replace('__TOKEN__', token)
      ),
    }),
    postcss({
      extract: 'main.css',
      minimize: production,
    }),
    replace({
      preventAssignment: false,
      __SERVER__: JSON.stringify(server),
    }),
    resolve({
      browser: true,
      moduleDirectories: [path.join(__dirname, 'node_modules')],
    }),
    svelte(), 
    {
      name: 'wgsl',
      transform(code, id) {
        if (/\.wgsl$/g.test(id)) {
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: { mappings: '' }
          };
        }
      }
    },
    ...(production ? [
      terser({ format: { comments: false } }),
      {
        writeBundle() {
          fs.writeFileSync(path.join(outputPath, 'CNAME'), 'voxeltoy.gatunes.com');
        },
      },
    ] : [
      serve({
        contentBase: outputPath,
        port: 8080,
      }),
      livereload(outputPath),
    ]),
  ],
  watch: { clearScreen: false },
};
