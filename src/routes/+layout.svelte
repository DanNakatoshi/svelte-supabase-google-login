<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { supabase } from '$lib/api/supabaseClient';

	let { children } = $props();

	onMount(async () => {
		if (typeof window !== 'undefined') {
			// If no session, try extracting from URL
			const { data, error } = await supabase.auth.getSession();
			if (!data.session) {
				console.warn('❌ No session found, forcing extraction from URL.');
				await userMgr.extractSessionFromUrl();
			} else {
				console.log('✅ Session retrieved:', data.session);
				await userMgr.fetchUser();
			}

			userMgr.fetchUser();
			console.log(localStorage.getItem('supabase.auth.token'));
			// Manually check if Supabase has an active session
			console.log('Current Session:', data.session);
		}
	});
</script>

{@render children()}
