import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { validateCredentials, createSession, getSession } from '$lib/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = getSession(cookies);
	
	// If already authenticated, redirect to admin dashboard
	if (session.authenticated) {
		throw redirect(302, '/admin');
	}
	
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, platform }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		
		if (!username || !password) {
			return fail(400, {
				error: 'Username and password are required',
				username
			});
		}
		
		const credentials = { username, password };
		
		if (!validateCredentials(credentials, platform!.env)) {
			return fail(401, {
				error: 'Invalid username or password',
				username
			});
		}
		
		createSession(cookies);
		throw redirect(302, '/admin');
	}
};
