<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/api/supabaseClient';

    let user = $state(null);

    // ログイン状態の監視
    onMount(async () => {
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();
        user = loggedInUser;

        supabase.auth.onAuthStateChange((event, session) => {
            user = session?.user ?? null;
        });
    });

    // Googleログイン
    async function signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'http://localhost:5173' }
        });
        if (error) console.error('ログインエラー:', error.message);
    }

    // ログアウト
    async function signOut() {
        await supabase.auth.signOut();
        user = null;
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h1 class="text-2xl font-bold mb-4">Googleログイン中</h1>

        {#if user}
            <!-- ログイン済み -->
            <div class="flex flex-col items-center space-y-4">
                <img src={user.user_metadata.avatar_url} alt="User Avatar" class="w-16 h-16 rounded-full">
                <p class="text-lg font-semibold">{user.user_metadata.full_name}</p>
                <p class="text-sm text-gray-500">{user.email}</p>
                <button onclick={signOut} class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    ログアウト
                </button>
            </div>
        {:else}
<<<<<<< Updated upstream
            <!-- 未ログイン -->
            <button onclick={signInWithGoogle} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
=======
            <button onclick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'http://localhost:5173/auth/callback' } }); }} class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
>>>>>>> Stashed changes
                Googleでログイン
            </button>
        {/if}
    </div>
</div>
