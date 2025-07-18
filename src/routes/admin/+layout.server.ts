import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = getSession(cookies);
	
	return {
		session
	};
};
