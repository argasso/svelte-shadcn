import { browser } from '$app/environment'
import { load_Page, load_Products, loadAll } from '$houdini'
import { DEFAULT_PAGE_SIZE, defaultSortKey, getActiveShopifyFilters, shortGID, sortOptions } from '$lib/components/filter/shopifyFilters'
import { get } from 'svelte/store'

export const load = async (event) => {
  const { url, parent } = event
  const handle = url.pathname.split('/').at(-1) ?? ''

  const { initialFilters, Pages } = await parent()
  const categories = get(Pages).data?.categories.nodes ?? []
  const category = categories.find(n => n.handle === handle)
  

  const searchParams = browser ? new URLSearchParams(url.searchParams) : new URLSearchParams()  
  if (category) {
    searchParams.append('category', shortGID(category.id))
  }

  const filters = getActiveShopifyFilters(initialFilters, categories, searchParams) 
  const first = browser && Number(url.searchParams.get('size')) || DEFAULT_PAGE_SIZE
  const {sortKey, reverse} = browser && sortOptions.find(s => s.value === (url.searchParams.get('sort'))) || defaultSortKey

  const totalCount = initialFilters?.find((f) => f.id === 'filter.v.availability')
  ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  return {
    ...(await loadAll(
      load_Products({ event, variables: { filters, first, sortKey, reverse } }),
      load_Page({ event, variables: { handle } }),
    )),
    Pages,
    initialFilters,
    pageInfo: { 
      size: first,
      totalCount,
    },
  }
}
