<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import { fly, slide } from 'svelte/transition'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { graphql, type ProductFilter } from '$houdini'
  import ListFilter from './ListFilter.svelte'
  import Filter from './ListFilter.svelte'
  import RangeFilter from './RangeFilter.svelte'
  import { isShopifyFilterKey, parseShopifyFilters } from './shopifyFilters'
  import ExpandToggle from './ExpandButton.svelte'
  import ExpandButton from './ExpandButton.svelte'
  import Icons from '../shopify/Icons.svelte'
  import Button from '../ui/button/button.svelte'

  export let appliedFilters: ProductFilter[]

  const filtersStore = graphql(`
    query Filters @load @cache(policy: CacheOrNetwork) {
      filters: collection(handle: "frontpage") {
        products(first: 0) {
          filters {
            id
            label
            type
            values {
              count
              id
              input
              label
            }
          }
        }
      }
      categories: metaobjects(first: 30, type: "category") {
        nodes {
          id
          title: field(key: "title") {
            value
          }
          parent: field(key: "parent") {
            value
          }
        }
      }
    }
  `)

  $: shopifyFilters = $filtersStore.data?.filters?.products.filters ?? []
  $: hierarchy = $filtersStore.data?.categories.nodes ?? []
  $: parsedFilters = parseShopifyFilters(shopifyFilters, hierarchy)
  $: filters = parsedFilters.map((f) => ({
    ...f,
    applied: $page.url.searchParams.has(f.values[0].key),
  }))
  function resetFilters() {
    selectedNumber = null
    const query = new URLSearchParams()
    $page.url.searchParams.forEach((value, key) => {
      if (!isShopifyFilterKey(key)) {
        query.append(key, value)
      }
    })
    goto(`?${query.toString()}`)
  }
  function selectNumber(value: number) {
    if (selectedNumber === value) {
      selectedNumber = null
    } else {
      selectedNumber = value
    }
  }
  let selectedNumber: number | null = null
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between py-2">
    <Card.Title>Urval</Card.Title>
    {#if appliedFilters?.length > 0}
      <!-- <div class="flex-grow">
				<span
					class="mx-1 mb-1 inline-flex h-5 items-center justify-center rounded-full bg-argasso-600 px-1.5 py-1 text-xs font-bold leading-none text-red-100"
					>{appliedFilters?.length}</span
				>
			</div> -->
      <Button variant="outline" on:click={resetFilters}>Nollställ</Button>
    {/if}
  </Card.Header>
  <Card.CardContent>
    {#each filters as filter, index}
      <div
        class="border-surface-200-700-token text-surface-600-300-token flex flex-col md:flex-row md:border-t"
      >
        <div class="block w-full border-b md:border-none">
          <div class="flex items-center">
            <button
              on:click={() => selectNumber(index)}
              class="text-md flex flex-grow items-center gap-1 py-3 text-left font-medium"
            >
              <span>{filter.label}</span>
              {#if filter.applied}
                <Icons type="checked" />
              {/if}
            </button>
            <div class="text-gray-400">
              <ExpandButton bind:selectedNumber myNumber={index} />
            </div>
          </div>
          {#if selectedNumber === index}
            <div transition:slide>
              {#if filter.type === 'PRICE_RANGE'}
                <RangeFilter {filter} />
              {:else}
                <ListFilter {filter} />
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </Card.CardContent>
</Card.Root>
