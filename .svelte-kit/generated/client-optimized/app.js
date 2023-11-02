export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9')
];

export const server_loads = [];

export const dictionary = {
		"/": [4],
		"/abouts": [5],
		"/abouts/[about_id=integer]": [6],
		"/products": [~7],
		"/products/[productId]": [~8,[],[2]],
		"/stocks": [9,[3]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';