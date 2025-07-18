import type { PageServerLoad, Actions } from './$types';
import { getSession, requireAuth } from '$lib/auth';
import { getAllPostsForAdmin, deletePost } from '$lib/blog';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const session = getSession(cookies);
	requireAuth(session);
	
	const posts = await getAllPostsForAdmin(platform!.env.DB);
	
	return {
		posts
	};
};

export const actions: Actions = {
	delete: async ({ request, platform, cookies }) => {
		const session = getSession(cookies);
		requireAuth(session);
		
		const data = await request.formData();
		const id = Number(data.get('id'));
		
		if (!id) {
			return fail(400, { error: 'Post ID is required' });
		}
		
		const success = await deletePost(platform!.env.DB, id);
		
		if (!success) {
			return fail(500, { error: 'Failed to delete post' });
		}
		
		return { success: true, message: 'Post deleted successfully' };
	}
};
