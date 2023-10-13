import { readable } from 'svelte/store';

export interface Post {
	title: string;
	slug: string;
	isPublished: boolean;
	datePublished: Date;
}

export const posts = readable<Post[]>([
	{
		title: 'Create a game inside an NFT',
		slug: 'create-a-game-inside-an-nft',
		isPublished: true,
		datePublished: new Date('2023-10-13')
	},
	{
		title: 'Create a Merkle Tree using NodeJs',
		slug: 'create-a-merkle-tree-using-nodejs',
		isPublished: true,
		datePublished: new Date('2022-12-22')
	},
	{
		title: 'Dockerize a Node API',
		slug: 'dockerize-a-node-api',
		isPublished: true,
		datePublished: new Date('2022-12-03')
	},
	{
		title: 'Build a simple GraphQL API with Go',
		slug: 'build-a-simple-graphql-api-with-go',
		isPublished: true,
		datePublished: new Date('2022-11-15')
	},
	{
		title: 'Build a CRON job with GoCron',
		slug: 'build-a-cron-job-with-gocron',
		isPublished: true,
		datePublished: new Date('2022-11-12')
	},
	{
		title: 'Configuring a Kubernetes NGINX Load Balancer',
		slug: 'configuring-a-kubernetes-nginx-load-balancer',
		isPublished: true,
		datePublished: new Date('2022-10-13')
	},
	{
		title: 'Configuring a Kubernetes Cert Manager',
		slug: 'configuring-a-kubernetes-cert-manager',
		isPublished: true,
		datePublished: new Date('2022-10-12')
	}
]);
