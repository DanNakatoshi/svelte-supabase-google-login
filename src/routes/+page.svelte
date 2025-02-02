<script>
    import { onMount } from "svelte";
    import { supabase } from "$lib/api/supabaseClient";
    import { Bookmark } from "lucide-svelte";

    let user = $state(null);
    let bookmarks = $state([]);

    let posts = [
        { id: 1, title: "とんこつらーめん", slug: "ramen" },
        { id: 2, title: "パスタ", slug: "pasta" },
        { id: 3, title: "餃子", slug: "dumpling" },
        { id: 4, title: "おにぎり", slug: "riceball" }
    ];

    async function fetchBookmarks(userId) {
        if (!userId) return;
        const { data, error } = await supabase
            .from("bookmarks_post")
            .select("post_id")
            .eq("user_id", userId); // 自分のブックマークのみ取得

        if (!error) {
            bookmarks = data.map((b) => b.post_id); // `post_id` の配列を作成
        }
    }

    async function addBookmark(postId, postSlug) {
        if (!user) {
            console.error("User not logged in");
            return;
        }

        // すでにブックマークされている場合は削除
        if (bookmarks.includes(postId)) {
            const { error } = await supabase
                .from("bookmarks_post")
                .delete()
                .eq("user_id", user.id)
                .eq("post_id", postId);

            if (!error) {
                bookmarks = bookmarks.filter((id) => id !== postId); // 配列から削除
            }
        } else {
            // 新規ブックマーク追加
            const { error } = await supabase.from("bookmarks_post").insert({
                post_id: postId,
                post_slug: postSlug,
                user_id: user.id
            });

            if (!error) {
                bookmarks = [...bookmarks, postId]; // 新しい post_id を追加
            }
        }
    }

    onMount(async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
            user = sessionData.session.user;
            await fetchBookmarks(user.id);
        }
    });
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <h1 class="mb-4 text-2xl font-bold">Googleログイン</h1>

        {#if user}
            <div class="flex flex-col items-center space-y-4">
                <img src={user.user_metadata.avatar_url} alt="User Avatar" class="h-16 w-16 rounded-full" />
                <div>UserID: {user.id}</div>
                <button onclick={async () => { await supabase.auth.signOut(); user = null; }} class="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600">
                    ログアウト
                </button>
            </div>
        {:else}
            <button onclick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'http://localhost:5173' } }); }} class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
                Googleでログイン
            </button>
        {/if}

        <!-- 投稿一覧 -->
        {#each posts as post}
            <div class="flex justify-between items-center p-2 border-b border-gray-200">
                <div>{post.title}</div>
                <button onclick={() => addBookmark(post.id, post.slug)}>
                    <Bookmark class={bookmarks.includes(post.id) ? "fill-black" : "fill-none"} />
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .fill-black {
        fill: black;
        stroke: black;
    }
</style>
