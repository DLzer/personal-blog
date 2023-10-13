<script lang="ts">
	export let data: {
		slug: string;
		post: string;
	};
</script>

<svelte:head>
	<title>Post | Dillon Lomnitzer Blog</title>
	<meta name="description" content="Welcome to Dillon Lomnitzer's personal blog!" />
	<meta name="keywords" content="Blog, Dillon Lomnitzer, Svelte, Go, Python" />
	<meta name="author" content="Dillon Lomnitzer" />
	<meta property="og:image" content="https://dlzer.dev/assets/dlzer.png" />
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dark.min.css"
	/>
</svelte:head>

<!-- dis"play the "post" field -->
<a href="/blog">Back</a>
{@html data.post}
