import { load_MainMenu } from '$houdini';
import { dev } from '$app/environment';
// Disable SSR when running the dev server
export const ssr = !dev;

export const prerender = true;
// export const trailingSlash = 'always'

export const load = async (event) => {
	const handle = 'startsida'
	return {
		...(await load_MainMenu({ event}))
	}
};
