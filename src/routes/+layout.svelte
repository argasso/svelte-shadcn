<script context="module" lang="ts">
	export type MenuItem = {
		href: string;
		name: string;
		children: MenuItem[];
	};
</script>

<script lang="ts">
	import '../app.pcss';
	import { onMount } from 'svelte';
	import NavLink from '$lib/components/NavLink.svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { browser } from '$app/environment';
	import { isCartOpen, isMenuOpen, noScroll } from '$lib/stores/store';
	import { flashCart, initiateCart, refreshCart } from '$lib/shopify';
	import { resolveHrefs } from '$lib';
	import ShopifySearch from '$lib/components/shopify/ShopifySearch.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import Cart from '$lib/components/shopify/Cart.svelte';

	export let data;

	$: ({ Pages } = data);

	$: resolved = resolveHrefs([
		...($Pages?.data?.pages.nodes || []),
		...($Pages?.data?.categories.nodes || [])
	]);

	$: menusById = new Map(
		resolved.map(({ id, title, name, href }) => [
			id,
			{
				name: name ?? title ?? '?',
				href,
				children: [] as MenuItem[]
			}
		])
	);

	$: menuItems = resolved.reduce((prev, node) => {
		const child = menusById.get(node.id);
		if (child) {
			if (node.parent) {
				const parent = menusById.get(node.parent);
				parent?.children.push(child);
			} else {
				prev.push(child);
			}
		}
		return prev;
	}, [] as MenuItem[]);

	$: if (browser) document.body.classList.toggle('noscroll', $noScroll);

	let headerHeight = 0;
	let scrollY = 0;
	let prevY = 0;
	let top = 0;
	let headerEl: HTMLElement;

	onMount(async () => {
		initiateCart();
		if (typeof window !== 'undefined') {
			document.addEventListener('keydown', (e) => {
				let keyCode = e.keyCode;
				if (keyCode === 27) {
					$isCartOpen = false;
				}
			});
		}
		// For header scrolling
		headerHeight = headerEl.clientHeight;
		prevY = headerEl.offsetTop;
	});

	async function openCart() {
		$isCartOpen = true;
		refreshCart();
	}
	function onScroll(e: UIEvent & { currentTarget: EventTarget & Window }) {
		scrollY = e.currentTarget.scrollY;
		top = Math.max(0, Math.min(headerHeight, top + scrollY - prevY));
		prevY = scrollY;
	}
</script>

<svelte:window on:scroll={onScroll} />

<ModeWatcher />
<div data-vaul-drawer-wrapperx>
	<header
		class:scrolled={scrollY > 0}
		class="gradient sticky top-0 flex h-[var(--header-height)] items-stretch"
		style:transform="translateY({-top}px)"
		bind:this={headerEl}
	>
		<div class="container flex justify-between">
			<nav class="flex items-stretch gap-4">
				<NavLink href="/" exact={true}>
					<Logo class="h-10 w-28" />
				</NavLink>
				<div class="hidden gap-4 md:flex">
					{#each menuItems as menuItem}
						<NavLink href={menuItem.href}>{menuItem.name}</NavLink>
					{/each}
				</div>
			</nav>
			<nav class="flex items-center gap-0">
				<ShopifySearch class="mr-2" />
				<LightSwitch />
				<Cart />
			</nav>
		</div>
	</header>

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style lang="postcss">
	header {
		--border: var(--primary-foreground);
		color: hsl(var(--primary-foreground));
	}
	[data-vaul-drawer-wrapperx] {
		background-color: hsl(var(--background));
	}
	.scrolled {
		@apply bg-opacity-95 shadow-lg ease-out;
	}
</style>
