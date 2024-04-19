<script lang="ts">
	import { Image } from '@unpic/svelte';
	import { onlyMediaImages } from '$lib';
	import ShopifyImage from '$lib/components/shopify/ShopifyImage.svelte';
	import type { PageData } from './$houdini';
	export let data: PageData;

	$: ({ Authors2 } = data);
	$: authors = $Authors2.data?.metaobjects.nodes;
</script>

<div class="container">
	{#if authors}
		<h1>Författare</h1>
		<div class="flow-root">
			<ul class="list-none divide-y divide-gray-200">
				{#each authors as author}
					<li class="py-3 sm:py-4">
						<div class="flex items-center space-x-4">
							<div class="flex-shrink-0">
								{#if author.image?.reference}
									<ShopifyImage
										class="h-16 w-16 rounded-full"
										image={onlyMediaImages([author.image?.reference])[0].image}
										width={100}
									/>
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<a
									href={`/information/forfattare/${author.handle}`}
									class="truncate text-sm font-medium text-gray-900"
								>
									{author.name?.value}
								</a>
								<p class="truncate text-sm text-gray-500">email@windster.com</p>
							</div>
							<div class="inline-flex items-center text-base font-semibold text-gray-900">$320</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
