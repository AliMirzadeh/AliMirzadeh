<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	
	export let form: ActionData;
	
	let loading = false;
</script>

<svelte:head>
	<title>Admin Login - Ali Mirzadeh</title>
</svelte:head>

<div class="admin-login-container">
	<div class="admin-login-card">
		<h1 class="admin-login-title">Admin Login</h1>
		
		{#if form?.error}
			<div class="admin-message error">
				{form.error}
			</div>
		{/if}
		
		<form method="POST" action="?/login" use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}} class="admin-login-form">
			<div class="admin-form-group">
				<label for="username" class="admin-form-label">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					value={form?.username ?? ''}
					required
					class="admin-form-input"
					placeholder="Enter your username"
				/>
			</div>
			
			<div class="admin-form-group">
				<label for="password" class="admin-form-label">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="admin-form-input"
					placeholder="Enter your password"
				/>
			</div>
			
			<button type="submit" disabled={loading} class="admin-btn admin-login-button">
				{#if loading}
					<span class="admin-loading">
						<span class="admin-spinner"></span>
						Signing in...
					</span>
				{:else}
					Sign In
				{/if}
			</button>
		</form>
	</div>
</div>
