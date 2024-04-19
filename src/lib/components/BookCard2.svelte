<script lang="ts">
	import Icons from './shopify/Icons.svelte';
	import type { Products$result } from '$houdini';
	import { authorUrl, bookUrl, onlyMetaobjects } from '$lib';
	import ShopifyImage from './shopify/ShopifyImage.svelte';
	import { addToCart, addToCartLoading } from '$lib/shopify';

	type BookThumb = NonNullable<Products$result['collection']>['products']['nodes'][number];
	export let bookThumb: BookThumb;
	export let width: number = 160;

	$: ({ title, handle, variants } = bookThumb);
	$: href = bookUrl(handle);
	$: image = bookThumb.images.nodes?.[0];
	$: authors = onlyMetaobjects(bookThumb.authors?.references?.nodes)
		.filter((n) => n.title?.value)
		.map(({ handle, title }) => ({
			href: authorUrl(handle),
			name: title?.value ?? ''
		}));
	$: discontinued = variants.nodes[0].discontinued?.value === 'true';
	$: ({ id: variantId, price } = variants.nodes[0]);
	async function addProduct() {
		await addToCart(variantId, { title, price, image });
	}
</script>

<div style="widthx: {width}px" class="mt-auto w-48">
	<div class="relative w-40">
		<a class="hover:no-underline" {href}>
			<ShopifyImage
				class="rounded bg-gray-100 drop-shadow ease-in-out hover:shadow-md"
				{image}
				{width}
			/>
			{#if discontinued}
				<div class="ribbon text-xs">Boken har utgått</div>
			{/if}
		</a>
		{#if !discontinued}
			<button on:click={addProduct} class="absolute -bottom-3 -right-4 flex items-center">
				<span class=" flex-1 overflow-hidden whitespace-nowrap">Lägg i varukorg</span>
				{#if $addToCartLoading === variantId}
					<Icons class="flex-0 text-xl" type="loading" />
				{:else}
					<Icons class="flex-0 text-xl" type="cart-add" />
				{/if}
			</button>
		{/if}
	</div>
	<div class="h-20 pt-2">
		<a {href}>
			<span class="my-1 text-base font-medium">{title}</span>
		</a>
		<div class="leading-4x">
			{#each authors as author, index}
				<a class="text-xs" href={author.href}>
					{author.name}
				</a>
				{#if index < authors.length - 1}
					&middot;&nbsp;
				{/if}
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	button {
		@apply w-9 rounded-full bg-primary p-2 px-2 text-xs text-white opacity-100;
	}

	button:hover,
	button:focus {
		@apply w-40 opacity-100 shadow-lg;
	}

	button:hover span,
	button:focus span {
		@apply inline-block;
	}

	/* Ribbon https://css-generators.com/ribbon-shapes/ */
	.ribbon {
		@apply text-sm text-white;
	}

	.ribbon {
		--r: 0.4em; /* control the ribbon shape (the radius) */
		--c: #888;

		position: absolute;
		bottom: -10px;
		right: calc(-1 * var(--r));
		line-height: 1.8;
		padding: calc(2 * var(--r)) 0.5em 0;
		border-radius: 0 var(--r) var(--r) 0;
		background:
			radial-gradient(100% 50% at right, var(--c) 98%, #0000 101%) 0 100%/0.5lh
				calc(100% - 2 * var(--r)),
			radial-gradient(100% 50% at left, #0005 98%, #0000 101%) 100% 0 / var(--r) calc(2 * var(--r)),
			conic-gradient(at calc(100% - var(--r)) calc(2 * var(--r)), var(--c) 75%, #0000 0) 100% 0 /
				calc(101% - 0.5lh) 100%;
		background-repeat: no-repeat;
	}
</style>
