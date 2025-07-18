<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	
	export let data: PageData;
	export let form: ActionData;
	
	let deleteLoading: Record<number, boolean> = {};
	
	function handleDelete(postId: number) {
		return async ({ formData, cancel }: any) => {
			if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
				cancel();
				return;
			}
			
			deleteLoading[postId] = true;
			
			return async ({ update }: any) => {
				await update();
				await invalidateAll();
				deleteLoading[postId] = false;
			};
		};
	}
</script>

<svelte:head>
	<title>Manage Posts - Admin Panel</title>
</svelte:head>

<div class="admin-header">
	<h1 class="admin-title">Posts</h1>
	<a href="/admin/posts/new" class="admin-btn">
		<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
		New Post
	</a>
</div>

{#if form?.message}
	<div class="admin-message success">
		{form.message}
	</div>
{/if}

{#if form?.error}
	<div class="admin-message error">
		{form.error}
	</div>
{/if}

<div class="admin-card">
	{#if data.posts.length > 0}
		<div class="admin-table-container">
			<table class="admin-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Slug</th>
						<th>Status</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.posts as post}
						<tr>
							<td>
								<div class="post-title-cell">
									<strong>{post.title}</strong>
									<br>
									<small class="post-excerpt">{post.excerpt}</small>
								</div>
							</td>
							<td>
								<code class="post-slug">{post.slug}</code>
							</td>
							<td>
								<span class="admin-status-badge {post.published ? 'published' : 'draft'}">
									{post.published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td>
								<time datetime={post.date}>
									{new Date(post.date).toLocaleDateString()}
								</time>
							</td>
							<td>
								<div class="admin-table-actions">
									<a href="/admin/posts/{post.id}/edit" class="admin-btn admin-btn-small admin-btn-secondary">
										<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
										</svg>
										Edit
									</a>
									
									{#if post.published}
										<a href="/blog/{post.slug}" target="_blank" class="admin-btn admin-btn-small admin-btn-secondary">
											<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
												<polyline points="15,3 21,3 21,9"></polyline>
												<line x1="10" y1="14" x2="21" y2="3"></line>
											</svg>
											View
										</a>
									{/if}
									
									<form method="POST" action="?/delete" use:enhance={handleDelete(post.id!)} style="display: inline;">
										<input type="hidden" name="id" value={post.id} />
										<button 
											type="submit" 
											class="admin-btn admin-btn-small admin-btn-danger"
											disabled={deleteLoading[post.id!]}
										>
											{#if deleteLoading[post.id!]}
												<span class="admin-spinner"></span>
											{:else}
												<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<polyline points="3,6 5,6 21,6"></polyline>
													<path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
												</svg>
											{/if}
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="empty-state">
			<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14,2 14,8 20,8"></polyline>
			</svg>
			<h3 class="empty-title">No posts yet</h3>
			<p class="empty-description">Get started by creating your first blog post.</p>
			<a href="/admin/posts/new" class="admin-btn">
				<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Create First Post
			</a>
		</div>
	{/if}
</div>

<style>
	.post-title-cell {
		max-width: 300px;
	}
	
	.post-excerpt {
		color: var(--text-muted);
		display: block;
		margin-top: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.post-slug {
		background: rgba(255, 255, 255, 0.1);
		padding: 4px 8px;
		border-radius: 4px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: var(--font-xs);
	}
	
	.empty-state {
		text-align: center;
		padding: var(--space-4xl);
		color: var(--text-muted);
	}
	
	.empty-icon {
		width: 64px;
		height: 64px;
		margin: 0 auto var(--space-lg);
		opacity: 0.5;
	}
	
	.empty-title {
		font-size: var(--font-xl);
		margin-bottom: var(--space-md);
		color: var(--text-primary);
	}
	
	.empty-description {
		margin-bottom: var(--space-xl);
		font-size: var(--font-base);
	}
	
	@media (max-width: 768px) {
		.post-title-cell {
			max-width: 200px;
		}
		
		.admin-table-actions {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-xs);
		}
		
		.admin-table-actions .admin-btn {
			justify-content: center;
		}
	}
</style>
