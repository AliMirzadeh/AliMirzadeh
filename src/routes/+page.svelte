<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Ali Mirzadeh - Software Engineer & Developer</title>
	<meta name="description" content="Software Engineer passionate about Java, Django, and modern web development. Computer Engineering graduate from Babol Noshirvani University of Technology." />
</svelte:head>

<main class="container">
	<!-- Compact Profile & Portfolio Card -->
	<section class="profile glass-card">
		<div class="profile-content">
			<h1 class="profile-title">Hi there 👋, I'm Ali Mirzadeh</h1>
			<p class="profile-subtitle">Software Engineer & Developer</p>
			<p class="profile-description">
				Computer Engineering graduate from <strong>Babol Noshirvani University of Technology (NIT)</strong>. 
				Passionate about Java, Django, and modern web development.
			</p>
			
			<!-- Compact Skills -->
			<div class="skills-compact">
				<span class="skill-tag">☕ Java</span>
				<span class="skill-tag">🐍 Django</span>
				<span class="skill-tag">🎨 JavaFX</span>
				<span class="skill-tag">⚡ C++</span>
				<span class="skill-tag">🌐 Web Dev</span>
				<span class="skill-tag">🔄 Agile</span>
			</div>
		</div>
	</section>

	<!-- Blog Section - Main Focus -->
	<section class="blog-section">
		<div class="posts-grid">
			{#each data.posts as post}
				<article class="glass-card post-card">
					<h3 class="post-title">
						<a href="/blog/{post.slug}">{post.title}</a>
					</h3>
					<time class="post-date">{new Date(post.date).toLocaleDateString('en-US', { 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric' 
					})}</time>
					<p class="post-excerpt">{post.excerpt}</p>
					<a href="/blog/{post.slug}" class="read-more">Read more →</a>
				</article>
			{/each}
		</div>
	</section>
</main>
