import { browser } from '$app/environment'
import { load_Page, load_Products, loadAll, type Page$result, type Pages$result, type ProductFilter } from '$houdini'
import { DEFAULT_PAGE_SIZE, defaultSortKey, getShopifyFilter, makeCategoryPath, shortGID, sortOptions } from '$lib/components/filter/shopifyFilters'
import { get } from 'svelte/store'

/* @type { import('./$houdini').PageLoad } */
export const load = async (event) => {
  const { url, parent } = event
  const handle = url.pathname.split('/').at(-1) ?? ''

  const { Pages, Filters } = await parent()
  const categories = get(Pages).data?.categories.nodes ?? []
  const category = categories.find(n => n.handle === handle)
  const categoryPath = makeCategoryPath(categories, category).map(shortGID).join('.')

  const searchParams = new URLSearchParams(url.searchParams)  
  searchParams.append('vo.book.category', categoryPath)

  const filters = browser && getShopifyFilter(searchParams) || []
  const first = browser && Number(url.searchParams.get('size')) || DEFAULT_PAGE_SIZE
  const {sortKey, reverse} = browser && sortOptions.find(s => s.value === (url.searchParams.get('sort'))) || defaultSortKey

  return {
    ...(await loadAll(
      load_Products({ event, variables: { filters, first, sortKey, reverse } }),
      load_Page({ event, variables: { handle } }),
    )),
    isFiltering: filters.length > 0,
    appliedFilters: filters,
    perPage: first,
    Pages,
    Filters,
  }
}
