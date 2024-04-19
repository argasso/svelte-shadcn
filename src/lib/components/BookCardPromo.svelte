<script lang="ts">
	import { fragment, graphql, type BookPromo } from '$houdini';
	import { bookUrl, onlyMetaobjects } from '$lib';
	import Link from './Link.svelte';
	import Pill from './Pill.svelte';
	import ShopifyImage from './shopify/ShopifyImage.svelte';

	export let book: BookPromo;
	$: data = fragment(
		book,
		graphql(`
			fragment BookPromo on Product {
				id
				title
				handle
				descriptionHtml
				images(first: 1) {
					nodes {
						url
						altText
						height
						width
					}
				}
				authors: metafield(namespace: "custom", key: "authors") {
					references(first: 3) {
						nodes {
							... on Metaobject {
								id
								handle
								name: field(key: "name") {
									value
								}
							}
						}
					}
				}
			}
		`)
	);
</script>

<div class="flex flex-row items-start">
	<div class="rounded-sm shadow-md">
		<a href={bookUrl($data.handle)} class="block w-[192px]">
			<ShopifyImage image={$data.images.nodes[0]} width={192} />
		</a>
	</div>
	<div class="flex flex-col items-start justify-center pl-6">
		{#if $data.authors?.references?.nodes}
			<p class="text-sm uppercase">
				{#each onlyMetaobjects($data.authors.references.nodes) as author}
					<Link class="text-xs" href={`/information/forfattare/${author.handle}`}>
						{author.name?.value}
					</Link>
				{/each}
			</p>
		{/if}

		<h3 class="my-0"><a href={$data.handle}>{$data.title}</a></h3>
		<p class="mb-4 line-clamp-6 leading-normal">
			{@html $data.descriptionHtml}
		</p>
		<!-- <p>
      {#each categories as category (category.href)}
        <Pill {category} />
      {/each}
    </p> -->
		<!-- <p class="text-xs uppercase text-gray-500">{generalDetails.publishMonth}</p> -->
	</div>
</div>
