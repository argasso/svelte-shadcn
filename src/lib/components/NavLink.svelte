<script lang="ts">
  import { page } from '$app/stores'
  export let href: string
  export let exact = false
  $: active =
    $page.url.pathname && href && exact
      ? $page.url.pathname === href
      : $page.url.pathname.includes(href)
</script>

<a
  {href}
  class:active
  class="mb-[2px] mt-[6px] flex border-b-4 border-transparent hover:border-white hover:border-opacity-70 hover:no-underline"
>
  <span class="my-auto">
    <slot />
  </span>
</a>

<style lang="postcss">
  a.active {
    @apply border-white;
  }
</style>
