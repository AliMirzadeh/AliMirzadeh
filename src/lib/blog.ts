import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogPost {
	title: string;
	date: string;
	slug: string;
	excerpt: string;
	content: string;
}

export interface BlogPostPreview {
	title: string;
	date: string;
	slug: string;
	excerpt: string;
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

export async function getAllPosts(): Promise<BlogPostPreview[]> {
	const posts: BlogPostPreview[] = [];
	
	try {
		// Read all markdown files from the blog directory at project root
		const blogDir = join(process.cwd(), 'blog');
		const files = readdirSync(blogDir).filter(file => file.endsWith('.md'));
		
		for (const filename of files) {
			try {
				const filePath = join(blogDir, filename);
				const fileContent = readFileSync(filePath, 'utf-8');
				const { data } = matter(fileContent);
				
				posts.push({
					title: data.title,
					date: data.date,
					slug: data.slug,
					excerpt: data.excerpt
				});
			} catch (error) {
				console.warn(`Could not read post: ${filename}`, error);
			}
		}
	} catch (error) {
		console.warn('Could not read blog directory', error);
	}
	
	// Sort by date (newest first)
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<BlogPost | null> {
	try {
		const filePath = join(process.cwd(), 'blog', `${slug}.md`);
		const fileContent = readFileSync(filePath, 'utf-8');
		const { data, content } = matter(fileContent);
		
		return {
			title: data.title,
			date: data.date,
			slug: data.slug,
			excerpt: data.excerpt,
			content: await marked(content)
		};
	} catch (error) {
		console.warn(`Could not read post: ${slug}`, error);
		return null;
	}
}

export async function getPostWithNavigation(slug: string): Promise<BlogPostWithNavigation | null> {
	try {
		const post = await getPost(slug);
		if (!post) return null;

		// Get all posts to find previous/next
		const allPosts = await getAllPosts();
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
