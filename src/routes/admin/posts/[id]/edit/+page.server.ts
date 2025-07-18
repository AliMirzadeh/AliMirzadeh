import type { PageServerLoad, Actions } from './$types';
import { getSession, requireAuth } from '$lib/auth';
import { getPostForAdmin, updatePost } from '$lib/blog';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies, platform, url }) => {
	const session = getSession(cookies);
	requireAuth(session);
	
	const postId = Number(params.id);
	if (!postId) {
		throw error(404, 'Post not found');
	}
	
	const post = await getPostForAdmin(platform!.env.DB, postId);
	if (!post) {
		throw error(404, 'Post not found');
	}
	
	return {
		post,
		created: url.searchParams.get('created') === 'true'
	};
};

function createSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
		.substring(0, 100);
}

export const actions: Actions = {
	save: async ({ request, platform, cookies, params }) => {
		const session = getSession(cookies);
		requireAuth(session);
		
		const postId = Number(params.id);
		if (!postId) {
			return fail(400, { error: 'Invalid post ID' });
		}
		
		const data = await request.formData();
		const title = data.get('title') as string;
		const slug = data.get('slug') as string || createSlug(title);
		const excerpt = data.get('excerpt') as string;
		const content = data.get('content') as string;
		const published = data.get('published') === 'on';
		
		if (!title || !excerpt || !content) {
			return fail(400, {
				error: 'Title, excerpt, and content are required',
				values: {
					title: title || '',
					slug: slug || '',
					excerpt: excerpt || '',
					content: content || '',
					published: published || false
				}
			});
		}
		
		try {
			const success = await updatePost(platform!.env.DB, postId, {
				title,
				slug,
				excerpt,
				content,
				published
			});
			
			if (success) {
				return { success: 'Post updated successfully' };
			} else {
				return fail(500, {
					error: 'Failed to update post',
					values: {
						title: title || '',
						slug: slug || '',
						excerpt: excerpt || '',
						content: content || '',
						published: published || false
					}
				});
			}
		} catch (error) {
			return fail(500, {
				error: 'Failed to update post. Make sure the slug is unique.',
				values: {
					title: title || '',
					slug: slug || '',
					excerpt: excerpt || '',
					content: content || '',
					published: published || false
				}
			});
		}
	}
};
