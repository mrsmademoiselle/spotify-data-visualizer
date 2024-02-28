import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import 'dotenv/config';

const config: UserConfig = {
	plugins: [sveltekit()],
	build: {},
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	}
};
export default config;
