<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	export let isOpen = false;
	import type { Link } from './Header.svelte';

	export let links: Link[];

	let resizeHandler: () => void;
	onMount(() => {
		if (browser) {
			// Check if the code is running in the browser
			resizeHandler = () => {
				if (window.innerWidth > 1024) isOpen = false;
			};
			window.addEventListener('resize', resizeHandler);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', resizeHandler);
		}
	});
</script>

{#if isOpen}
	<button class="fixed lg:hidden inset-0 bg-black/40 z-10" on:click={() => (isOpen = false)}>
		<div class="z-50 absolute left-0 top-0 w-full card">
			<div class="flex justify-between items-center z-10">
				<span class="text-white font-semibold text-xl"
					>Wealth<span
						class="text-transparent bg-clip-text bg-gradient-to-b from-brand-light to-brand-default"
						>Kit</span
					></span
				>
				<button class="text-white p-1 hover:text-brand-default" on:click={() => (isOpen = false)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<nav>
				<ul class="py-4">
					{#each links as link}
						<!-- <NavLink {link} /> -->
					{/each}
				</ul>
			</nav>
		</div>
	</button>
{/if}
