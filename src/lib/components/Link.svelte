<script lang="ts">
  import { page } from '$app/stores'

  let active = false
  $: active =
    href != null && page != null && $page.url.pathname != null && $page.url.pathname.includes(href)

  let className = ''
  export { className as class }

  export let href: string | undefined = undefined
</script>

{#if href}
  <a {href} class="hover:underline {className}" class:active>
    <slot />
  </a>
{:else}
  <slot />
{/if}
