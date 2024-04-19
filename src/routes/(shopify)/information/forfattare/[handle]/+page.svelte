<script lang="ts">
	import { Image } from '@unpic/svelte';
	import { onlyMediaImages } from '$lib';
	import ShopifyImage from '$lib/components/shopify/ShopifyImage.svelte';

	import type { PageData } from './$houdini';
	import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText';
	import BookCard2 from '$lib/components/BookCard2.svelte';

	export let data: PageData;
	$: ({ Author, Products } = data);
	$: author = $Author.data?.author;
	$: html = author?.description?.value
		? convertSchemaToHtml(JSON.parse(author?.description?.value))
		: undefined;

	$: products = $Products.data?.collection?.products.nodes ?? [];
</script>

<div class="container mt-10">
	<!-- <Breadcrumb crumbs={breadcrumbs} /> -->

	<article>
		<div class="flex flex-col items-start gap-2 md:flex-row">
			<div class="flex-1">
				<h2>{author?.title?.value}</h2>
				{#if html}
					<div>{@html html}</div>
				{/if}
			</div>
			<div class="max-w-xs flex-shrink">
				{#if author?.image?.reference}
					<ShopifyImage
						class="h-72 w-72 rounded-full"
						image={onlyMediaImages([author.image?.reference])[0].image}
						width={500}
					/>
				{:else}
					<Image src={'/uploads/foerfattare/anonymous.jpg'} width={500} />
				{/if}
			</div>
		</div>
	</article>
	{#if products?.length > 0}
		<section>
			<h3>Böcker av {author?.title?.value}</h3>
			<div
				class="grid grid-cols-2 justify-items-start gap-x-3 gap-y-10 py-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
			>
				{#each products as bookThumb (bookThumb.handle)}
					<div class="self-end">
						<BookCard2 {bookThumb} />
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
