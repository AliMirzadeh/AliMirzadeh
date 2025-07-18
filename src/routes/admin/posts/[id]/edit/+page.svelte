<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	
	export let data: PageData;
	export let form: ActionData;
	
	let loading = false;
	let title = form?.values?.title ?? data.post.title;
	let slug = form?.values?.slug ?? data.post.slug;
	let excerpt = form?.values?.excerpt ?? data.post.excerpt;
	let content = form?.values?.content ?? data.post.content;
	let published = form?.values?.published ?? data.post.published;
	
	function generateSlug() {
		if (title) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.trim()
				.substring(0, 100);
		}
	}
	
	onMount(() => {
		// Show creation success message
		if (data.created) {
			const message = document.createElement('div');
			message.className = 'admin-message success';
			message.textContent = 'Post created successfully!';
			message.style.marginBottom = 'var(--space-lg)';
			
			const header = document.querySelector('.admin-header');
			if (header) {
				header.insertAdjacentElement('afterend', message);
				
				// Remove message after 5 seconds
				setTimeout(() => {
					message.remove();
				}, 5000);
			}
		}
	});
</script>

<svelte:head>
	<title>Edit: {data.post.title} - Admin Panel</title>
</svelte:head>

<div class="admin-header">
	<h1 class="admin-title">Edit Post</h1>
	<div class="header-actions">
		{#if data.post.published}
			<a href="/blog/{data.post.slug}" target="_blank" class="admin-btn admin-btn-secondary">
				<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
					<polyline points="15,3 21,3 21,9"></polyline>
					<line x1="10" y1="14" x2="21" y2="3"></line>
				</svg>
				View Post
			</a>
		{/if}
		<a href="/admin/posts" class="admin-btn admin-btn-secondary">
			<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H6m0 0L12 6m-6 6L12 18"></path>
			</svg>
			Back to Posts
		</a>
	</div>
</div>

{#if form?.success}
	<div class="admin-message success">
		{form.success}
	</div>
{/if}

{#if form?.error}
	<div class="admin-message error">
		{form.error}
	</div>
{/if}

<div class="admin-card">
	<div class="admin-card-header">
		<h2 class="admin-card-title">Post Details</h2>
		<div class="post-meta">
			<span class="admin-status-badge {data.post.published ? 'published' : 'draft'}">
				{data.post.published ? 'Published' : 'Draft'}
			</span>
			<span class="post-date">
				Created: {new Date(data.post.date).toLocaleDateString()}
			</span>
		</div>
	</div>
	
	<form method="POST" action="?/save" use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update();
		};
	}} class="admin-form">
		<div class="admin-form-row">
			<div class="admin-form-group">
				<label for="title" class="admin-form-label">Title *</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					required
					class="admin-form-input"
					placeholder="Enter post title"
				/>
			</div>
		</div>
		
		<div class="admin-form-row">
			<div class="admin-form-group">
				<label for="slug" class="admin-form-label">Slug *</label>
				<input
					type="text"
					id="slug"
					name="slug"
					bind:value={slug}
					required
					class="admin-form-input"
					placeholder="post-url-slug"
				/>
				<small class="form-help">URL: /blog/{slug}</small>
			</div>
			<div class="admin-form-group">
				<button type="button" on:click={generateSlug} class="admin-btn admin-btn-secondary">
					Generate from Title
				</button>
			</div>
		</div>
		
		<div class="admin-form-group">
			<label for="excerpt" class="admin-form-label">Excerpt *</label>
			<textarea
				id="excerpt"
				name="excerpt"
				bind:value={excerpt}
				required
				class="admin-form-textarea"
				placeholder="Brief description of the post"
				rows="3"
			></textarea>
			<small class="form-help">This will be shown in post previews and social media shares</small>
		</div>
		
		<div class="admin-form-group">
			<label for="content" class="admin-form-label">Content *</label>
			<textarea
				id="content"
				name="content"
				bind:value={content}
				required
				class="admin-form-textarea large"
				placeholder="Write your post content in Markdown..."
			></textarea>
			<small class="form-help">You can use Markdown formatting</small>
		</div>
		
		<div class="admin-form-group">
			<label class="admin-form-label checkbox-label">
				<input
					type="checkbox"
					name="published"
					bind:checked={published}
					class="admin-form-checkbox"
				/>
				Publish this post
			</label>
			<small class="form-help">Uncheck to save as draft</small>
		</div>
		
		<div class="form-actions">
			<button type="submit" disabled={loading} class="admin-btn">
				{#if loading}
					<span class="admin-loading">
						<span class="admin-spinner"></span>
						Saving...
					</span>
				{:else}
					<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
						<polyline points="17,21 17,13 7,13 7,21"></polyline>
						<polyline points="7,3 7,8 15,8"></polyline>
					</svg>
					Save Changes
				{/if}
			</button>
			
			<a href="/admin/posts" class="admin-btn admin-btn-secondary">
				Cancel
			</a>
		</div>
	</form>
</div>

<style>
	.header-actions {
		display: flex;
		gap: var(--space-md);
		align-items: center;
	}
	
	.post-meta {
		display: flex;
		gap: var(--space-md);
		align-items: center;
	}
	
	.post-date {
		color: var(--text-muted);
		font-size: var(--font-sm);
	}
	
	.form-help {
		display: block;
		margin-top: var(--space-xs);
		color: var(--text-muted);
		font-size: var(--font-xs);
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		cursor: pointer;
		margin-bottom: 0;
	}
	
	.form-actions {
		display: flex;
		gap: var(--space-md);
		align-items: center;
		margin-top: var(--space-xl);
		padding-top: var(--space-lg);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	@media (max-width: 768px) {
		.header-actions {
			flex-direction: column;
			align-items: stretch;
		}
		
		.post-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
		}
		
		.form-actions {
			flex-direction: column;
			align-items: stretch;
		}
		
		.form-actions .admin-btn {
			justify-content: center;
		}
	}
</style>
