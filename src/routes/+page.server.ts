import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/blog';

export const load: PageServerLoad = async () => {
	const posts = await getAllPosts();
	
	return {
		posts
	};
};
