import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/blog';

export const load: PageServerLoad = async ({ platform }) => {
	const posts = await getAllPosts(platform!.env.DB);
	
	return {
		posts
	};
};
