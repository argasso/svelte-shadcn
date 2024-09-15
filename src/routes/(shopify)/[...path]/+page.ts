import { browser } from '$app/environment'
import { load_Page, load_Products, loadAll } from '$houdini'
import { DEFAULT_PAGE_SIZE, defaultSortKey, getActiveShopifyFilters, shortGID, sortOptions } from '$lib/components/filter/shopifyFilters'
import { findMenuItem, makeMenu } from '$lib/menu.js'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

export const load = async (event) => {
  const { url, parent } = event
  const { initialFilters, MainMenu } = await parent()
  const handle = url.pathname.split('/').at(-1) ?? ''
  const searchParams = browser ? new URLSearchParams(url.searchParams) : new URLSearchParams()  
  
  const menu = makeMenu(get(MainMenu).data?.menu) 
  const category = findMenuItem(menu,  url.pathname)

  if (category) {
    searchParams.append('category', shortGID(category.id))
  }

  const filters = getActiveShopifyFilters(initialFilters, menu, searchParams) 

  const first = browser && Number(url.searchParams.get('size')) || DEFAULT_PAGE_SIZE
  const {sortKey, reverse} = browser && sortOptions.find(s => s.value === (url.searchParams.get('sort'))) || defaultSortKey

  const totalCount = initialFilters?.find((f) => f.id === 'filter.v.availability')
  ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  // const { Page } = await load_Page({ event, variables: { handle } })
  // const page = get(Page)

  // if (page.errors) {
  //   error(400, page.errors.join(', '))
  // }
  // else if (!page.data) {
  //   console.log('hmm', page )
  //   error(404, 'Oj, vi hittar inte det du söker')
  // }
  
  if (filters.length > 0) {
    return {
      ...(await load_Page({ event, variables: { handle } })),
      ...(await load_Products({ event, variables: { filters, first, sortKey, reverse }, policy: 'CacheAndNetwork' })),
      initialFilters,
      pageInfo: { 
        size: first,
        totalCount,
      },
    }
  } else {
    return {
      ...(await load_Page({ event, variables: { handle } })),
      initialFilters,
      pageInfo: { 
        size: first,
        totalCount,
      },
    }
  }
}
