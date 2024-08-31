<script lang="ts">
  import { page } from '$app/stores'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import { onlyMetaobjects, resolveHrefs } from '$lib'
  import { findMenuItem, getPathToItem, makeMenu } from '$lib/menu.js'

  export let data

  $: ({ MainMenu } = data)

  // $: resolved = resolveHrefs([
  //   ...($Pages.data?.pages.nodes || []),
  //   ...($Pages.data?.categories.nodes || []),
  // ])

  // $: crumbs = $page.url.pathname
  //   .split('/')
  //   .filter((p) => p.length > 0)
  //   .map((_v, index, arr) => {
  //     const href = `/${arr.slice(0, index + 1).join('/')}`
  //     const page = resolved.find((n) => n.href === href)
  //     const name = page?.name ?? page?.title ?? '?'
  //     return { name, href }
  //   })
  $: menuItems = makeMenu($MainMenu.data?.menu)
  $: crumbs = getPathToItem(findMenuItem(menuItems, $page.url.pathname))
</script>

<div class="container">
  <Breadcrumbs {crumbs} />
</div>

<slot />
