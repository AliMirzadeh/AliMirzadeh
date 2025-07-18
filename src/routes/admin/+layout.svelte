<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	export let data: LayoutData;
	
	let sidebarOpen = false;
	
	onMount(() => {
		// Close sidebar when clicking outside on mobile
		const handleClickOutside = (event: MouseEvent) => {
			const sidebar = document.querySelector('.admin-sidebar');
			const toggle = document.querySelector('.admin-mobile-toggle');
			
			if (sidebar && toggle && !sidebar.contains(event.target as Node) && !toggle.contains(event.target as Node)) {
				sidebarOpen = false;
			}
		};
		
		if (browser) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
	
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
	
	$: currentPath = $page.url.pathname;
</script>

<svelte:head>
	<title>Admin Panel - Ali Mirzadeh</title>
</svelte:head>

{#if data.session?.authenticated}
	<div class="admin-layout">
		<!-- Mobile menu toggle -->
		<button aria-label="Mobile hamburger menu" class="admin-mobile-toggle" onclick={toggleSidebar}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="3" y1="6" x2="21" y2="6"></line>
				<line x1="3" y1="12" x2="21" y2="12"></line>
				<line x1="3" y1="18" x2="21" y2="18"></line>
			</svg>
		</button>
		
		<!-- Overlay for mobile -->
		<button
			type="button"
			class="admin-overlay"
			class:show={sidebarOpen}
			aria-label="Close sidebar overlay"
			tabindex={sidebarOpen ? 0 : -1}
			onclick={() => sidebarOpen = false}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					sidebarOpen = false;
				}
			}}
			style="background: none; border: none; padding: 0; margin: 0; position: absolute; inset: 0; width: 100%; height: 100%;"
		></button>
		
		<!-- Sidebar -->
		<aside class="admin-sidebar" class:open={sidebarOpen}>
			<div class="admin-sidebar-header">
				<h2 class="admin-title">Admin Panel</h2>
				<p class="admin-subtitle">Welcome, {data.session.username}</p>
			</div>
			
			<nav class="admin-nav">
				<ul>
					<li class="admin-nav-item">
						<a href="/admin" class="admin-nav-link" class:active={currentPath === '/admin'}>
							<svg class="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="9" y1="9" x2="15" y2="9"></line>
								<line x1="9" y1="15" x2="15" y2="15"></line>
							</svg>
							Dashboard
						</a>
					</li>
					<li class="admin-nav-item">
						<a href="/admin/posts" class="admin-nav-link" class:active={currentPath.startsWith('/admin/posts')}>
							<svg class="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14,2 14,8 20,8"></polyline>
								<line x1="16" y1="13" x2="8" y2="13"></line>
								<line x1="16" y1="17" x2="8" y2="17"></line>
								<polyline points="10,9 9,9 8,9"></polyline>
							</svg>
							Posts
						</a>
					</li>
					<li class="admin-nav-item">
						<a href="/admin/posts/new" class="admin-nav-link" class:active={currentPath === '/admin/posts/new'}>
							<svg class="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							New Post
						</a>
					</li>
					<li class="admin-nav-item">
						<a href="/" class="admin-nav-link" target="_blank">
							<svg class="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
								<polyline points="15,3 21,3 21,9"></polyline>
								<line x1="10" y1="14" x2="21" y2="3"></line>
							</svg>
							View Site
						</a>
					</li>
					<li class="admin-nav-item">
						<form method="POST" action="/admin/logout" style="margin: 0;">
							<button type="submit" class="admin-nav-link" style="background: none; border: none; width: 100%; text-align: left; cursor: pointer;">
								<svg class="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
									<polyline points="16,17 21,12 16,7"></polyline>
									<line x1="21" y1="12" x2="9" y2="12"></line>
								</svg>
								Logout
							</button>
						</form>
					</li>
				</ul>
			</nav>
		</aside>
		
		<!-- Main content -->
		<main class="admin-main">
			<slot />
		</main>
	</div>
{:else}
	<slot />
{/if}

<style>
	.admin-subtitle {
		color: var(--text-muted);
		font-size: var(--font-sm);
		margin-top: var(--space-sm);
		margin-bottom: var(--space-xl);
	}
	
	.admin-sidebar-header {
		margin-bottom: var(--space-xl);
		padding-bottom: var(--space-lg);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>
