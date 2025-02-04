// Supabase
import { supabase } from '$lib/api/supabaseClient';

let redirectURL = 'http://localhost:5173/';

function createUserData() {
	let user = $state(null);
	let session = $state(null);

	async function fetchUser() {
		const { data, error } = await supabase.auth.getSession();

		if (error || !data.session) {
			console.warn('No active session found.');
			user = null;
			session = null;
			return;
		}

		user = data.session.user;
		session = data.session;
		console.log('User:', user);
		console.log('Session:', session);
	}

	// Googleログイン
	async function signInWithGoogle() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: 'http://localhost:5173/' }
		});

		if (error) {
			console.error('Login error:', error.message);
			return;
		}

		// ✅ Force session refresh after login
		setTimeout(async () => {
			const { data, error: refreshError } = await supabase.auth.refreshSession();
			if (refreshError) console.error('Session refresh failed:', refreshError.message);
			else console.log('🔄 Session refreshed:', data);
		}, 2000);
	}

	// ログアウト
	async function signOut() {
		await supabase.auth.signOut();
		user = null;
		session = null;
	}

	// ✅ Extract session from URL after login
    async function extractSessionFromUrl() {
        const url = new URL(window.location.href);
        const access_token = url.hash.match(/access_token=([^&]*)/)?.[1];
        const refresh_token = url.hash.match(/refresh_token=([^&]*)/)?.[1];
    
        if (!access_token || !refresh_token) {
            console.warn('❌ No tokens found in URL.');
            return;
        }
    
        console.log('✅ Extracted tokens:', { access_token, refresh_token });
    
        const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
        });
    
        if (error) {
            console.error('❌ Session extraction error:', error.message);
            return;
        }
    
        console.log('✅ Session successfully set:', data.session);
    
        // Cleanup URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    

	// ✅ Listen for auth state changes (only in browser)
	if (typeof window !== 'undefined') {
		supabase.auth.onAuthStateChange((event, newSession) => {
			console.log(`Auth event: ${event}`, newSession);
			user = newSession ? newSession.user : null;
			session = newSession ?? null;
		});
	}

	// 初回実行時にユーザー情報を取得
	fetchUser();

	return {
		user, // Directly exposes the reactive $state
		signInWithGoogle,
		signOut,
		fetchUser,
		extractSessionFromUrl
	};
}

export const userMgr = createUserData();
