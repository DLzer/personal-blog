<script>
	import { posts } from '../stores/posts.store';

	let latest_posts = $posts.slice(0, 3);
</script>

<svelte:head>
	<title>Home | Dillon Lomnitzer Blog</title>
	<meta name="description" content="Welcome to Dillon Lomnitzer's personal blog!" />
	<meta name="keywords" content="Blog, Dillon Lomnitzer, Svelte, Go, Python" />
	<meta name="author" content="Dillon Lomnitzer" />
	<meta property="og:image" content="https://dlzer.dev/assets/dlzer.png" />
</svelte:head>

<section>
	<h1>Dillon Lomnitzer | Blog</h1>

	<h3>Latest Posts</h3>
	<hr />
	{#each latest_posts as post}
		<div class="post">
			<a href="/blog/{post.slug}" style="margin-top: 4px; font-size: 24px;">
				{post.title}
			</a>
			<p>{post.datePublished}</p>
		</div>
		<hr />
	{/each}

	<h3>To see more posts vist <a href="/blog">Blog</a> page</h3>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		font-size: 3rem;
		text-align: center;
	}
	.post {
		text-align: left;
	}
</style>
