import type { PageServerLoad } from './$types';
import { getSession, requireAuth } from '$lib/auth';
import { getAllPostsForAdmin } from '$lib/blog';

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const session = getSession(cookies);
	requireAuth(session);
	
	const posts = await getAllPostsForAdmin(platform!.env.DB);
	
	return {
		session,
		posts,
		stats: {
			totalPosts: posts.length,
			publishedPosts: posts.filter(p => p.published).length,
			draftPosts: posts.filter(p => !p.published).length
		}
	};
};
