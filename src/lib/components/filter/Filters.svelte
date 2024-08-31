<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import * as Accordion from '$lib/components/ui/accordion'
  import Icons from '../shopify/Icons.svelte'
  import ListFilter from './ListFilter.svelte'
  import RangeFilter from './RangeFilter.svelte'
  import { isShopifyFilterKey, type EnhancedFilter } from './shopifyFilters'

  export let filters: EnhancedFilter[] = []
  // export let categories: Pages$result['categories']['nodes']
  // export let categoryId: string | undefined

  // $: enhancedFilters = enhanceFilters(filters, $page.url.searchParams)

  // let filters = parsedFilters
  // $: filters = parsedFilters && parsedFilters.length > 0 ? parsedFilters : filters

  // export let appliedFilters: ProductFilter[]
  //  export let filters: NonNullable<Products$result['collection']>['products']['filters'] | null
  //  export let categoryId: string | undefined = undefined
  //  export let categories: Categories$result

  // const filtersStore = graphql(`
  //   query Filters @load @cache(policy: CacheOrNetwork) {
  //     filters: collection(handle: "frontpage") {
  //       products(first: 0) {
  //         filters {
  //           id
  //           label
  //           type
  //           values {
  //             count
  //             id
  //             input
  //             label
  //           }
  //         }
  //       }
  //     }
  //     categories: metaobjects(first: 30, type: "category") {
  //       nodes {
  //         id
  //         title: field(key: "title") {
  //           value
  //         }
  //         parent: field(key: "parent") {
  //           value
  //         }
  //       }
  //     }
  //   }
  // `)

  // $: shopifyFilters = $filtersStore.data?.filters?.products.filters ?? []
  // $: hierarchy = categories.metaobjects.nodes ?? []
  // $: parsedFilters = parseShopifyFilters(filters ?? [], hierarchy, categoryId)
  //   .filter((f) => f.values.length > 0)
  //   .map((f) => ({
  //     ...f,
  //     applied: $page.url.searchParams.has(f.values[0].key),
  //   }))

  // $: countById = new Map(
  //   parsedFilters?.flatMap((f) => f.values.filter((v) => v.count).map((v) => [v.id, v.count])) ??
  //     [],
  // )

  function resetFilters() {
    selectedId = null
    const query = new URLSearchParams()
    $page.url.searchParams.forEach((value, key) => {
      if (!isShopifyFilterKey(key)) {
        query.append(key, value)
      }
    })
    goto(`?${query.toString()}`)
  }

  let selectedId: string | null = null
</script>

<Accordion.Root>
  {#each filters as filter (filter.id)}
    <Accordion.Item value={filter.id}>
      <Accordion.Trigger>
        <div class="flex items-center gap-1 text-sm">
          {filter.label}
          {#if filter.active}
            <Icons type="checked" class="text-card-foreground" />
          {/if}
        </div>
      </Accordion.Trigger>
      <Accordion.Content>
        {#if filter.type === 'PRICE_RANGE'}
          <RangeFilter {filter} />
        {:else}
          <ListFilter {filter} />
        {/if}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
