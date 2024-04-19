<script lang="ts">
	import Filters from '$lib/components/filter/Filters.svelte';
	import GridSelect from '$lib/components/grid/GridSelect.svelte';
	import type { PageData } from './$houdini';
	import Icons from '$lib/components/shopify/Icons.svelte';
	import { sizeOptions } from '$lib/components/filter/shopifyFilters';
	import BookCard2 from '$lib/components/BookCard2.svelte';
	import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText';
	import LinkList from '$lib/components/LinkList.svelte';
	import { resolveHrefs } from '$lib';

	export let data: PageData;

	$: ({ Products, isFiltering, appliedFilters, Pages, Page } = data);
	$: products = $Products.data?.collection?.products.nodes ?? [];
	$: filters = $Products.data?.collection?.products.filters ?? [];
	$: totalCount =
		filters
			?.find((f) => f.id === 'filter.v.availability')
			?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0;
	$: ({ startCursor, endCursor, hasNextPage, hasPreviousPage } = $Products.pageInfo);

	$: pages = resolveHrefs([
		...($Pages.data?.pages.nodes || []),
		...($Pages.data?.categories.nodes || [])
	]);

	$: page = $Page.data?.page ?? $Page.data?.category;

	$: categories = pages
		.filter((p) => p.parent === page?.id)
		.map(({ name, title, href }) => ({
			name: name ?? title ?? '?',
			href
		}));

	// $: ({ title, name, content } = page)
	$: heading = page?.title?.value ?? page?.name?.value;
	$: html = page?.content?.value
		? convertSchemaToHtml(JSON.parse(page?.content?.value))
		: undefined;

	const sortOptions = [
		{
			value: 'BEST_SELLING',
			title: 'bäst säljande'
		},
		{
			value: 'CREATED',
			title: 'nyast först'
		},
		{
			value: 'PRICE',
			title: 'pris'
		},
		{
			value: 'RELEVANCE',
			title: 'relevans'
		},
		{
			value: 'TITLE',
			title: 'titel'
		}
	];
</script>

<!-- <Modal title="Urval" open={$isOverlayOpen} on:close={() => isOverlayOpen.set(false)}>
  <div class="">
    <div>
      {#if $bookStore.filtering}
        <button class="btn-square px-5" on:click={() => bookStore.reset()}>Nollställ urval</button>
      {:else}
        <p class="m-0 p-0 text-sm font-light leading-9">Gör ett urval nedan</p>
      {/if}
    </div>
    {#each $bookStore.filters as filter}
      <div class="flex flex-col md:flex-row md:border-b">
        <BookFilter {filter} />
      </div>
    {/each}
  </div>
</Modal> -->

<!-- <div class="flex gap-3 items-stretch">
      <h4>Visar {$bookFilterStore.books.length} av {$bookFilterStore.total} böcker</h4>
    </div> -->

<div class="container mb-10 flex flex-col gap-4 lg:flex-row">
	<main class="flex-grow">
		<h1>{heading}</h1>
		{#if html}
			<div>{@html html}</div>
		{/if}
		<div
			class="grid flex-auto grid-cols-2 justify-items-start gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
		>
			{#if products.length > 0}
				{#each products as p (p.id)}
					<div class="self-end">
						<div class="self-end">
							<BookCard2 bookThumb={p} />
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<div class="flex items-center gap-3">
			<GridSelect queryKey="size" suffix="per sida" options={sizeOptions} class="" />

			<button
				class="btn-square px-1"
				on:click={() => Products.loadPreviousPage({ last: 12, before: startCursor || undefined })}
				disabled={!hasPreviousPage}
			>
				<Icons type="arrowLeft" />
			</button>
			<button
				class="btn-square px-1"
				on:click={() => Products.loadNextPage({ first: 12, after: endCursor || undefined })}
				disabled={!hasNextPage}
			>
				<Icons type="arrowRight" />
			</button>
		</div>
	</main>
	<aside class="flex-0 w-64">
		<LinkList class="w-full lg:w-64" title="Avdelningar" links={categories} />
		<Filters {appliedFilters} />
	</aside>
</div>

<div class="container mb-10">
	<div class="flex items-center justify-between bg-slate-50 p-2">
		<h4 class="my-0 flex-1">
			{totalCount} böcker
			{#if isFiltering}
				i urvalet
			{:else}
				i denna avdelning
			{/if}
		</h4>
		<div class="flex flex-1 flex-col gap-3 sm:flex-row">
			<!-- <FilterButton class="lg:hidden" {criterias} /> -->
			<GridSelect queryKey="sort" prefix="Visa" prefixSelected="Visar" options={sortOptions} />

			<!-- <Pagination class="hidden lg:flex" pageing={$bookStore} /> -->
		</div>
	</div>
</div>
<div class="container mb-10"></div>
