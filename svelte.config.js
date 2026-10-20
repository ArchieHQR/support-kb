import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({ extensions: ['.svx'], layout: { runbook } }),
  ],
  kit: {
    adapter: adapter({ pages: process.env.OUT ?? 'build', assets: process.env.OUT ?? 'build', strict: false }),
    alias: { '#lib': 'src/lib' },
    paths: { base: process.env.BASE_PATH ?? '' },
    prerender: { entries: ['*'], handleHttpError: 'warn' },
    inlineStyleThreshold: Infinity,
  },
};
