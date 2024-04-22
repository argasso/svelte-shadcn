<script lang="ts">
  import { page } from '$app/stores'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import { resolveHrefs } from '$lib'

  export let data

  $: ({ Pages } = data)

  $: resolved = resolveHrefs([
    ...($Pages.data?.pages.nodes || []),
    ...($Pages.data?.categories.nodes || []),
  ])

  $: crumbs = $page.url.pathname
    .split('/')
    .filter((p) => p.length > 0)
    .map((_v, index, arr) => {
      const href = `/${arr.slice(0, index + 1).join('/')}`
      const page = resolved.find((n) => n.href === href)
      const name = page?.name ?? page?.title ?? '?'
      return { name, href }
    })

  $: loading = $Pages.fetching // || true
</script>

<div class="container">
  <Breadcrumbs {crumbs} {loading} />
</div>

<slot />
