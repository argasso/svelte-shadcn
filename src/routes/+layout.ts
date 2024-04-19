import { load_Pages } from '$houdini';

export const prerender = true;
// export const trailingSlash = 'always'

export const load = async (event) => {
	const { Pages } = await load_Pages({ event });
	return { Pages };
};
