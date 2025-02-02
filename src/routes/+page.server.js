// import { supabase } from '$lib/api/supabaseClient';

// export async function load() {
//     const { data, error } = await supabase
//         .from('bookmarks_post')
//         .select('*')

//     if (error) {
//         console.error(error);
//         throw new Error('Failed to fetch bookmarks_post');
//     }

//     return { bookmarks_post: data };
// }