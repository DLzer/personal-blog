<script>
	import { posts } from '../../stores/posts.store';
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Dlzers Blog" />
</svelte:head>

<section>
	<h1>Blog Post Archive</h1>
	<hr />
	{#each $posts as post}
		<div>
			<a href="/blog/{post.slug}" style="margin-top: 4px; font-size: 24px;">
				{post.title}
			</a>
			<p>{post.datePublished}</p>
		</div>
		<hr />
	{/each}
</section>

<style>
	:global(em) {
		color: #a79494;
		background-color: #100f0f;
		overflow-x: auto;
		padding: 5px 5px;
		border-radius: 10px;
		font-style: initial;
	}
	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
