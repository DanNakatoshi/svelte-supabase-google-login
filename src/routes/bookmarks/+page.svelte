<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/api/supabaseClient';

	let bookmarks = [];

	onMount(async () => {
		console.log("Fetching bookmarks..");

		const { data, error } = await supabase.from('bookmarks_post').select('*');
		console.log(data);
		console.log(error);

		bookmarks = data || [];
	});
</script>

{#if bookmarks.length}
	<ul>
		{#each bookmarks as bookmark}
			<li>
				<p><strong>ID:</strong> {bookmark.id}</p>
				<p><strong>Article ID:</strong> {bookmark.post_id}</p>
				<p>{new Date(bookmark.created_at).toLocaleString()}</p>
			</li>
		{/each}
	</ul>
{/if}
