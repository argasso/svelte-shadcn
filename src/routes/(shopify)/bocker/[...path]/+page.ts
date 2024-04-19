import { browser } from '$app/environment'
import { load_Page, load_Products, loadAll } from '$houdini'
import { DEFAULT_PAGE_SIZE, getShopifyFilter } from '$lib/components/filter/shopifyFilters.js'

/* @type { import('./$houdini').PageLoad } */
export const load = async (event) => {
  const { url, parent } = event

  const { Pages } = await parent()

  const filters = browser ? getShopifyFilter(url.searchParams) : []
  const pageSize = browser
    ? Number(url.searchParams.get('size') ?? DEFAULT_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE
  const handle = url.pathname.split('/').at(-1) ?? ''

  return {
    ...(await loadAll(
      load_Products({ event, variables: { filters, first: pageSize } }),
      load_Page({ event, variables: { handle } }),
    )),
    isFiltering: filters.length > 0,
    appliedFilters: filters,
    pageSize,
    Pages,
  }
}
