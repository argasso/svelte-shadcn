<script lang="ts">
  import { browser } from '$app/environment'
  import { page as pageStore } from '$app/stores'
  import { type Products$result } from '$houdini'
  import BookCard from '$lib/components/BookCard4.svelte'
  import LinkList from '$lib/components/LinkList.svelte'
  import Section from '$lib/components/Section.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import AppliedFilterButton from '$lib/components/filter/AppliedFilterButton.svelte'
  import MobileFilter from '$lib/components/filter/MobileFilter.svelte'
  import {
    getCategoryFilterAsTree,
    getDecendants,
    getEnhancedFilter,
    sizeOptions,
    sortOptions,
    type EnhancedFilter,
    type EnhancedFilterItem,
  } from '$lib/components/filter/shopifyFilters'
  import GridSelect from '$lib/components/grid/GridSelect.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import Separator from '$lib/components/ui/separator/separator.svelte'
  import { findMenuItem, makeMenu } from '$lib/menu'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import ChevronLeft from 'svelte-radix/ChevronLeft.svelte'
  import ChevronRight from 'svelte-radix/ChevronRight.svelte'

  type ProductsResult = NonNullable<Products$result['collection']>['products']

  export let data

  $: ({ Products, Page, initialFilters, pageInfo, MainMenu } = data)

  let products: ProductsResult['nodes'] | undefined
  let productFilters: ProductsResult['filters'] | undefined
  let filters: EnhancedFilter[]
  let appliedFilters: EnhancedFilterItem[]

  $: {
    if (Products && $Products) {
      products = $Products.data?.collection?.products.nodes ?? products ?? [] // Keep old data until new arrive
      productFilters = $Products.data?.collection?.products.filters ?? productFilters ?? [] // Keep old data until new arrive
      const searchParams = browser ? $pageStore.url.searchParams : new URLSearchParams()
      const enhancedFilters = productFilters.map((f) =>
        getEnhancedFilter(f, searchParams, initialFilters),
      )
      filters = enhancedFilters.map((f) => getCategoryFilterAsTree(f, menu?.children ?? []))
      appliedFilters = filters
        .flatMap(({ values }) => values.flatMap(getDecendants))
        .filter((v) => v.active)
    }
  }

  $: menu = findMenuItem(makeMenu($MainMenu.data?.menu), $pageStore.url.pathname)
  $: links = menu?.children

  $: page = $Page.data?.page
  $: title = page?.title?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content.value)) : undefined
  $: count = products?.length ?? pageInfo.size
  $: totalCount =
    filters
      ?.find((f) => f.id === 'filter.v.availability')
      ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0
</script>

{#if page}
  <Seo {page} pageTitle={title} pageContent={page.content?.value} />
{/if}

{#if !$Page.fetching && $Page.data?.page}
  <Section>
    <div class="flex flex-row gap-10">
      <div class="flex-1">
        <h1 class="mb-8 mt-0 w-full text-center md:text-left">
          {title}
        </h1>
        {#if html}
          {@html html}
        {/if}
        <!-- {#if links}
        <div class="flex">
          {#each links as link}
            <div><Button variant="outline" href={link.href}>{link.name}</Button></div>
          {/each}
        </div>
      {/if} -->
      </div>
      <aside class="flex-0 hidden w-64 min-w-64 md:block">
        <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} />
      </aside>
    </div>
  </Section>
{/if}

<!-- <div class="container mb-10 flex flex-col gap-4 lg:flex-row"> -->
{#if Products && $Products}
  <Section class="bg-card">
    <div class="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
      <div class="mr-2">
        Visar {count}
        {#if totalCount > pageInfo.size}
          av {totalCount}
        {/if}
        böcker
      </div>
      <div class="my-2 hidden self-stretch md:flex">
        <Separator orientation="vertical" />
      </div>
      <GridSelect key="sort" label="Välj ordning" options={sortOptions} />
      <div class="my-2 hidden self-stretch md:flex">
        <Separator orientation="vertical" />
      </div>
      <GridSelect key="size" label="Antal per sida" options={sizeOptions} suffix="per sida" />
      <div class="my-2 hidden self-stretch md:flex">
        <Separator orientation="vertical" />
      </div>
      <MobileFilter {filters} />
      <div class="flex flex-1 justify-end">
        <Button
          variant="ghost"
          class="gap-1 pl-2.5 font-normal"
          on:click={() =>
            Products.loadPreviousPage({
              last: pageInfo.size,
              before: $Products.pageInfo.startCursor || undefined,
            })}
          disabled={!$Products.pageInfo.hasPreviousPage}
        >
          <ChevronLeft class="h-4 w-4" />
          <span>Föregående</span>
        </Button>

        <Button
          variant="ghost"
          class="gap-1 pr-2.5  font-normal"
          on:click={() =>
            Products.loadNextPage({
              first: pageInfo.size,
              after: $Products.pageInfo.endCursor || undefined,
            })}
          disabled={!$Products.pageInfo.hasNextPage}
        >
          <span>Nästa</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div class="mb-5 flex gap-2 text-gray-500">
      {#each appliedFilters as filter (filter.id)}
        <AppliedFilterButton {filter}></AppliedFilterButton>
      {/each}
    </div>
    <!-- <Separator class="my-2" /> -->
    <div
      class="grid flex-auto grid-cols-2 justify-items-start gap-x-4 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    >
      {#if products && products.length > 0}
        {#each products as p}
          <div class="self-end">
            <BookCard bookThumb={p} loading={$Products.fetching} />
          </div>
        {/each}
      {:else}
        <div class="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-6">
          <h2>Vi hittar inga böcker som matchar urvalet</h2>
          <p>Prova att ändra gjorda urval eller nollställ urvalet.</p>
        </div>
      {/if}
    </div>
    <div class="my-3 flex flex-wrap items-center gap-2 pb-6 text-sm text-gray-600">
      <div class="mr-2">
        Visar {count}
        {#if totalCount > pageInfo.size}
          av {totalCount}
        {/if}
        böcker
      </div>
      <div class="my-2 hidden self-stretch md:flex">
        <Separator orientation="vertical" />
      </div>
      <GridSelect key="sort" label="Välj ordning" options={sortOptions} />
      <div class="my-2 hidden self-stretch md:flex">
        <Separator orientation="vertical" />
      </div>
      <GridSelect key="size" label="Antal per sida" options={sizeOptions} suffix="per sida" />
      <div class="my-2 hidden self-stretch md:flex">
        <Separator orientation="vertical" />
      </div>
      <MobileFilter {filters} />
      <div class="flex flex-1 justify-end">
        <Button
          variant="ghost"
          class="gap-1 pl-2.5 font-normal"
          on:click={() =>
            Products.loadPreviousPage({
              last: pageInfo.size,
              before: $Products.pageInfo.startCursor || undefined,
            })}
          disabled={!$Products.pageInfo.hasPreviousPage}
        >
          <ChevronLeft class="h-4 w-4" />
          <span>Föregående</span>
        </Button>

        <Button
          variant="ghost"
          class="gap-1 pr-2.5  font-normal"
          on:click={() =>
            Products.loadNextPage({
              first: pageInfo.size,
              after: $Products.pageInfo.endCursor || undefined,
            })}
          disabled={!$Products.pageInfo.hasNextPage}
        >
          <span>Nästa</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </Section>
{/if}
<!-- <aside class="flex-0 hidden w-64 min-w-64 md:block">
    <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} />
    {#if Products && $Products}
      <FiltersCard class="sticky top-16 shadow-sm" {filters} />
    {/if}
  </aside> -->
<!-- </div> -->
