import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface AdminSession {
    authenticated: boolean;
    username?: string;
}

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

export function validateCredentials(credentials: AuthCredentials, env: any): boolean {
    const validUsername = env.ADMIN_USERNAME;
    const validPassword = env.ADMIN_PASSWORD;
    
    return credentials.username === validUsername && credentials.password === validPassword;
}

export function createSession(cookies: Cookies): void {
    const sessionData = {
        authenticated: true,
        username: 'ali',
        timestamp: Date.now()
    };
    
    cookies.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
        path: '/',
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'strict'
    });
}

export function getSession(cookies: Cookies): AdminSession {
    const sessionCookie = cookies.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie) {
        return { authenticated: false };
    }
    
    try {
        const sessionData = JSON.parse(sessionCookie);
        
        // Check if session is expired
        if (Date.now() - sessionData.timestamp > SESSION_DURATION * 1000) {
            return { authenticated: false };
        }
        
        return {
            authenticated: true,
            username: sessionData.username
        };
    } catch {
        return { authenticated: false };
    }
}

export function destroySession(cookies: Cookies): void {
    cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function requireAuth(session: AdminSession): void {
    if (!session.authenticated) {
        throw redirect(302, '/admin/login');
    }
}