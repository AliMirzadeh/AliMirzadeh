<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.post.title} - Ali's Blog</title>
	<meta name="description" content={data.post.excerpt} />
</svelte:head>

<main class="container">
	<article class="glass-card post">
		<header class="post-header">
			<h1>{data.post.title}</h1>
			<time class="post-date">{new Date(data.post.date).toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			})}</time>
		</header>

		<div class="post-content">
			{@html data.post.content}
		</div>
	</article>

	<!-- Post Navigation -->
	{#if data.post.previousPost || data.post.nextPost}
		<nav class="post-navigation glass-card">
			<div class="nav-links">
				{#if data.post.previousPost}
					<a href="/blog/{data.post.previousPost.slug}" class="nav-link nav-previous" class:nav-single={!data.post.nextPost}>
						<div class="nav-direction">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="15,18 9,12 15,6"></polyline>
							</svg>
							Previous
						</div>
						<div class="nav-title">{data.post.previousPost.title}</div>
					</a>
				{/if}
				
				{#if data.post.nextPost}
					<a href="/blog/{data.post.nextPost.slug}" class="nav-link nav-next" class:nav-single={!data.post.previousPost}>
						<div class="nav-direction">
							Next
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="9,18 15,12 9,6"></polyline>
							</svg>
						</div>
						<div class="nav-title">{data.post.nextPost.title}</div>
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</main>
