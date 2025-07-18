import { marked } from 'marked';

export interface BlogPost {
	id?: number;
	title: string;
	date: string;
	slug: string;
	excerpt: string;
	content: string;
	published?: boolean;
}

export interface BlogPostPreview {
	id?: number;
	title: string;
	date: string;
	slug: string;
	excerpt: string;
	published?: boolean;
}

export interface BlogPostWithNavigation extends BlogPost {
	previousPost?: BlogPostPreview;
	nextPost?: BlogPostPreview;
}

// Configure marked for better HTML output
marked.setOptions({
	breaks: true,
	gfm: true
});

export async function getAllPosts(db: D1Database): Promise<BlogPostPreview[]> {
	try {
		const { results } = await db.prepare(
			'SELECT id, title, created_at as date, slug, excerpt, published FROM blog_posts WHERE published = 1 ORDER BY created_at DESC'
		).all();
		
		return results.map(post => ({
			id: post.id as number,
			title: post.title as string,
			date: post.date as string,
			slug: post.slug as string,
			excerpt: post.excerpt as string,
			published: true
		}));
	} catch (error) {
		console.warn('Could not read blog posts from database', error);
		return [];
	}
}

export async function getPost(db: D1Database, slug: string): Promise<BlogPost | null> {
	try {
		const { results } = await db.prepare(
			'SELECT id, title, created_at as date, slug, excerpt, content, published FROM blog_posts WHERE slug = ? AND published = 1'
		).bind(slug).all();
		
		if (results.length === 0) return null;
		
		const post = results[0];
		return {
			id: post.id as number,
			title: post.title as string,
			date: post.date as string,
			slug: post.slug as string,
			excerpt: post.excerpt as string,
			content: await marked(post.content as string),
			published: true
		};
	} catch (error) {
		console.warn(`Could not read post: ${slug}`, error);
		return null;
	}
}

export async function getPostWithNavigation(db: D1Database, slug: string): Promise<BlogPostWithNavigation | null> {
	try {
		const post = await getPost(db, slug);
		if (!post) return null;

		// Get all posts to find previous/next
		const allPosts = await getAllPosts(db);
		const currentIndex = allPosts.findIndex(p => p.slug === slug);
		
		if (currentIndex === -1) return post;

		// Previous post is the one that comes after in the sorted array (older)
		const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
		// Next post is the one that comes before in the sorted array (newer)
		const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

		return {
			...post,
			previousPost,
			nextPost
		};
	} catch (error) {
		console.warn(`Could not read post with navigation: ${slug}`, error);
		return null;
	}
}

// CMS Functions
export async function createPost(db: D1Database, post: {title: string, slug: string, excerpt: string, content: string, published?: boolean}): Promise<number | null> {
	try {
		// First check if slug already exists
		const existing = await db.prepare('SELECT id FROM blog_posts WHERE slug = ?').bind(post.slug).first();
		if (existing) {
			console.warn('Slug already exists:', post.slug);
			return null;
		}
		
		// Insert the new post
		const result = await db.prepare(
			'INSERT INTO blog_posts (title, slug, excerpt, content, published) VALUES (?, ?, ?, ?, ?)'
		).bind(
			post.title, 
			post.slug, 
			post.excerpt, 
			post.content, 
			post.published ? 1 : 0
		).run();
		
		console.log('Insert result:', result);
		
		if (result.success && result.meta) {
			// Try different ways to get the ID
			const insertId = result.meta.last_row_id || result.meta.lastRowId || result.meta.rowId;
			if (insertId) {
				console.log('Created post with ID:', insertId);
				return Number(insertId);
			}
		}
		
		// If we can't get the ID from meta, try to find it by slug
		if (result.success) {
			const newPost = await db.prepare('SELECT id FROM blog_posts WHERE slug = ? ORDER BY id DESC LIMIT 1').bind(post.slug).first();
			if (newPost) {
				console.log('Found created post with ID:', newPost.id);
				return Number(newPost.id);
			}
		}
		
		console.warn('Failed to insert post or get ID:', result);
		return null;
	} catch (error) {
		console.error('Could not create post:', error);
		return null;
	}
}

export async function updatePost(db: D1Database, id: number, post: Partial<BlogPost>): Promise<boolean> {
	try {
		const setClauses = [];
		const values = [];
		
		if (post.title !== undefined) {
			setClauses.push('title = ?');
			values.push(post.title);
		}
		if (post.slug !== undefined) {
			setClauses.push('slug = ?');
			values.push(post.slug);
		}
		if (post.excerpt !== undefined) {
			setClauses.push('excerpt = ?');
			values.push(post.excerpt);
		}
		if (post.content !== undefined) {
			setClauses.push('content = ?');
			values.push(post.content);
		}
		if (post.published !== undefined) {
			setClauses.push('published = ?');
			values.push(post.published);
		}
		
		setClauses.push('updated_at = CURRENT_TIMESTAMP');
		values.push(id);
		
		await db.prepare(
			`UPDATE blog_posts SET ${setClauses.join(', ')} WHERE id = ?`
		).bind(...values).run();
		
		return true;
	} catch (error) {
		console.warn('Could not update post', error);
		return false;
	}
}

export async function deletePost(db: D1Database, id: number): Promise<boolean> {
	try {
		await db.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
		return true;
	} catch (error) {
		console.warn('Could not delete post', error);
		return false;
	}
}

export async function getAllPostsForAdmin(db: D1Database): Promise<BlogPost[]> {
	try {
		const { results } = await db.prepare(
			'SELECT id, title, created_at as date, slug, excerpt, content, published FROM blog_posts ORDER BY created_at DESC'
		).all();
		
		return results.map(post => ({
			id: post.id as number,
			title: post.title as string,
			date: post.date as string,
			slug: post.slug as string,
			excerpt: post.excerpt as string,
			content: post.content as string,
			published: post.published as boolean
		}));
	} catch (error) {
		console.warn('Could not read blog posts from database', error);
		return [];
	}
}

export async function getPostForAdmin(db: D1Database, id: number): Promise<BlogPost | null> {
	try {
		const { results } = await db.prepare(
			'SELECT id, title, created_at as date, slug, excerpt, content, published FROM blog_posts WHERE id = ?'
		).bind(id).all();
		
		if (results.length === 0) return null;
		
		const post = results[0];
		return {
			id: post.id as number,
			title: post.title as string,
			date: post.date as string,
			slug: post.slug as string,
			excerpt: post.excerpt as string,
			content: post.content as string,
			published: post.published as boolean
		};
	} catch (error) {
		console.warn(`Could not read post: ${id}`, error);
		return null;
	}
}
