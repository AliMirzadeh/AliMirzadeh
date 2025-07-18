<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: stats = data.stats;
</script>

<svelte:head>
	<title>Admin Dashboard - Ali Mirzadeh</title>
</svelte:head>

<div class="admin-header">
	<h1 class="admin-title">Dashboard</h1>
	<a href="/admin/posts/new" class="admin-btn">
		<svg class="admin-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
		New Post
	</a>
</div>

<!-- Stats Cards -->
<div class="stats-grid">
	<div class="stat-card">
		<div class="stat-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14,2 14,8 20,8"></polyline>
			</svg>
		</div>
		<div class="stat-content">
			<h3 class="stat-title">Total Posts</h3>
			<p class="stat-number">{stats.totalPosts}</p>
		</div>
	</div>
	
	<div class="stat-card">
		<div class="stat-icon published">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="20,6 9,17 4,12"></polyline>
			</svg>
		</div>
		<div class="stat-content">
			<h3 class="stat-title">Published</h3>
			<p class="stat-number">{stats.publishedPosts}</p>
		</div>
	</div>
	
	<div class="stat-card">
		<div class="stat-icon draft">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
			</svg>
		</div>
		<div class="stat-content">
			<h3 class="stat-title">Drafts</h3>
			<p class="stat-number">{stats.draftPosts}</p>
		</div>
	</div>
</div>

<!-- Recent Posts -->
<div class="admin-card">
	<div class="admin-card-header">
		<h2 class="admin-card-title">Recent Posts</h2>
		<a href="/admin/posts" class="admin-btn admin-btn-secondary admin-btn-small">
			View All
		</a>
	</div>
	
	{#if data.posts.length > 0}
		<div class="admin-table-container">
			<table class="admin-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Status</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.posts.slice(0, 5) as post}
						<tr>
							<td>
								<div class="post-title-cell">
									<strong>{post.title}</strong>
									<br>
									<small class="post-excerpt">{post.excerpt}</small>
								</div>
							</td>
							<td>
								<span class="admin-status-badge {post.published ? 'published' : 'draft'}">
									{post.published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td>
								{new Date(post.date).toLocaleDateString()}
							</td>
							<td>
								<div class="admin-table-actions">
									<a href="/admin/posts/{post.id}/edit" class="admin-btn admin-btn-small admin-btn-secondary">
										Edit
									</a>
									{#if post.published}
										<a href="/blog/{post.slug}" target="_blank" class="admin-btn admin-btn-small admin-btn-secondary">
											View
										</a>
									{/if}
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
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-lg);
		margin-bottom: var(--space-2xl);
	}
	
	.stat-card {
		display: flex;
		align-items: center;
		padding: var(--space-xl);
		background: var(--card-bg);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}
	
	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		background: rgba(255, 0, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: var(--space-lg);
		flex-shrink: 0;
	}
	
	.stat-icon.published {
		background: rgba(34, 197, 94, 0.2);
	}
	
	.stat-icon.draft {
		background: rgba(251, 191, 36, 0.2);
	}
	
	.stat-icon svg {
		width: 24px;
		height: 24px;
		color: var(--primary-magenta);
	}
	
	.stat-icon.published svg {
		color: #22c55e;
	}
	
	.stat-icon.draft svg {
		color: #fbbf24;
	}
	
	.stat-content {
		flex: 1;
	}
	
	.stat-title {
		font-size: var(--font-sm);
		color: var(--text-secondary);
		margin-bottom: var(--space-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 500;
	}
	
	.stat-number {
		font-size: var(--font-2xl);
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}
	
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
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.post-title-cell {
			max-width: 200px;
		}
	}
</style>
