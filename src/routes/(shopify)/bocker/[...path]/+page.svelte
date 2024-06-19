<script lang="ts">
  import { browser } from '$app/environment'
  import { page as pageStore } from '$app/stores'
  import Filters from '$lib/components/filter/Filters.svelte'
  import GridSelect from '$lib/components/grid/GridSelect.svelte'
  import type { PageData } from './$houdini'
  import {
    getCategoryFilterAsTree,
    getDecendants,
    getEnhancedFilter,
    sizeOptions,
    sortOptions,
  } from '$lib/components/filter/shopifyFilters'
  import BookCard2 from '$lib/components/BookCard2.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import LinkList from '$lib/components/LinkList.svelte'
  import { resolveHrefs } from '$lib'
  import { getSingleValueQueryStore } from '$lib/stores/URLSearchParamsStore'
  import Button from '$lib/components/ui/button/button.svelte'
  import ChevronLeft from 'svelte-radix/ChevronLeft.svelte'
  import ChevronRight from 'svelte-radix/ChevronRight.svelte'
  import MobileFilter from '$lib/components/filter/MobileFilter.svelte'
  import AppliedFilterButton from '$lib/components/filter/AppliedFilterButton.svelte'
  import { type Products$result } from '$houdini'

  type ProductsResult = NonNullable<Products$result['collection']>['products']

  export let data: PageData

  let cursor = getSingleValueQueryStore('cursor')
  let direction = getSingleValueQueryStore('direction')

  $: ({ Products, Pages, Page, initialFilters, pageInfo } = data)

  let products: ProductsResult['nodes'] = []
  $: products = $Products.data?.collection?.products.nodes ?? products // Keep old data until new arrive

  let productFilters: ProductsResult['filters'] = []
  $: productFilters = $Products.data?.collection?.products.filters ?? productFilters // Keep old data until new arrive

  $: pages = resolveHrefs([
    ...($Pages.data?.pages.nodes || []),
    ...($Pages.data?.categories.nodes || []),
  ])

  $: page = $Page.data?.page ?? $Page.data?.category

  $: links = pages
    .filter((p) => p.parent === page?.id)
    .map(({ name, title, href }) => ({
      name: name ?? title ?? '?',
      href,
    }))

  $: categories = $Pages.data?.categories.nodes ?? []
  $: categoryId = $Page.data?.category?.id

  $: searchParams = browser ? $pageStore.url.searchParams : new URLSearchParams()
  $: enhancedFilters = productFilters.map((f) => getEnhancedFilter(f, searchParams, initialFilters))
  $: filters = enhancedFilters.map((f) => getCategoryFilterAsTree(f, categories, categoryId))
  $: appliedFilters = filters
    .flatMap(({ values }) => values.flatMap(getDecendants))
    .filter((v) => v.active)
  $: totalCount =
    initialFilters
      ?.find((f) => f.id === 'filter.v.availability')
      ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  $: ({ startCursor, endCursor, hasNextPage, hasPreviousPage } = $Products.pageInfo)

  $: heading = page?.title?.value ?? page?.name?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content?.value)) : undefined
  // $: parsedFilters = parseShopifyFilters(
  //   filters,
  //   $Pages.data?.categories.nodes ?? [],
  //   $pageStore.url.searchParams,
  //   categoryId,
  // )
  // $: console.log('parsedFilters', parsedFilters)
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

    <!-- <h2 class="my-0 mt-10 flex-1">
      {totalCount} böcker
      {#if isFiltering}
        i urvalet
      {:else}
        i denna avdelning
      {/if}
    </h2> -->
    <div class="my-4 flex flex-wrap gap-3 pt-10">
      <!-- <FilterButton class="lg:hidden" {criterias} /> -->
      <GridSelect class="w-36" key="sort" options={sortOptions} label="Välj ordning" />
      <MobileFilter class="md:hidden" {filters} />
      {#each appliedFilters as filter (filter.id)}
        <AppliedFilterButton {filter}></AppliedFilterButton>
      {/each}
    </div>
    <div
      class="grid flex-auto grid-cols-2 justify-items-start gap-x-4 gap-y-14 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
    >
      {#if products.length > 0}
        {#each products as p}
          <div class="self-end">
            <BookCard2 bookThumb={p} loading={$Products.fetching} />
          </div>
        {/each}
      {/if}
    </div>
    <div class="flex items-center gap-3">
      <GridSelect key="size" suffix="per sida" options={sizeOptions} class="w-32" />

      <Button
        variant="ghost"
        class="gap-1 pl-2.5"
        on:click={() =>
          Products.loadPreviousPage({ last: pageInfo.size, before: startCursor || undefined })}
        disabled={!hasPreviousPage}
      >
        <ChevronLeft class="h-4 w-4" />
        <span>Föregående</span>
      </Button>

      <Button
        variant="ghost"
        class="gap-1 pr-2.5"
        on:click={() =>
          Products.loadNextPage({ first: pageInfo.size, after: endCursor || undefined })}
        disabled={!hasNextPage}
      >
        <span>Nästa</span>
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </main>
  <aside class="flex-0 hidden w-64 min-w-64 md:block">
    <LinkList
      class="mb-3 w-full bg-background shadow-sm lg:w-64"
      title="Underavdelningar"
      {links}
    />
    <Filters class="sticky top-16 bg-background shadow-sm" {filters} />
  </aside>
</div>
