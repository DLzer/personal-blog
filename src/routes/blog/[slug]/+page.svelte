<script lang="ts">
	export let data: {
		slug: string;
		post: string;
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dark.min.css"
	/>
</svelte:head>

<!-- dis"play the "post" field -->
<a href="/blog">Back</a>
{@html data.post}
