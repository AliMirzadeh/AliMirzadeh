import type { PageServerLoad, Actions } from './$types';
import { getSession, requireAuth } from '$lib/auth';
import { createPost } from '$lib/blog';
import { initializeDatabase, testDatabaseConnection } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const session = getSession(cookies);
	requireAuth(session);
	
	// Initialize database if needed
	if (platform?.env.DB) {
		await initializeDatabase(platform.env.DB);
	}
	
	return {};
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
	save: async ({ request, platform, cookies }) => {
		const session = getSession(cookies);
		requireAuth(session);
		
		const data = await request.formData();
		const title = data.get('title') as string;
		const slug = data.get('slug') as string || createSlug(title);
		const excerpt = data.get('excerpt') as string;
		const content = data.get('content') as string;
		const published = data.get('published') === 'on';
		
		// Validation
		if (!title || !excerpt || !content) {
			return fail(400, {
				error: 'Title, excerpt, and content are required',
				title,
				slug,
				excerpt,
				content,
				published
			});
		}
		
		if (!slug) {
			return fail(400, {
				error: 'Slug is required',
				title,
				slug,
				excerpt,
				content,
				published
			});
		}
		
		// Clean the slug
		const cleanSlug = slug
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim()
			.substring(0, 100);
		
		if (!cleanSlug) {
			return fail(400, {
				error: 'Invalid slug. Please use only letters, numbers, and hyphens.',
				title,
				slug,
				excerpt,
				content,
				published
			});
		}
		
		console.log('Creating post with data:', { title, slug: cleanSlug, excerpt, content, published });
		
		const postId = await createPost(platform!.env.DB, {
			title: title.trim(),
			slug: cleanSlug,
			excerpt: excerpt.trim(),
			content: content.trim(),
			published
		});
		
		console.log('Post creation result:', postId);
		
		if (postId && postId > 0) {
			console.log('Redirecting to edit page for post:', postId);
			redirect(303, `/admin/posts/${postId}/edit?created=true`);
		} else {
			console.warn('Post creation returned null or invalid ID:', postId);
			return fail(500, {
				error: 'Failed to create post. The slug might already exist.',
				title,
				slug: cleanSlug,
				excerpt,
				content,
				published
			});
		}
	}
};
