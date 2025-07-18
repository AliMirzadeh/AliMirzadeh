import type { PageServerLoad } from './$types';
import { getPostWithNavigation } from '$lib/blog';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform }) => {
	const post = await getPostWithNavigation(platform!.env.DB, params.slug);
	
	if (!post) {
		throw error(404, 'Post not found');
	}
	
	return {
		post
	};
};
