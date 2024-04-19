<script lang="ts">
  export let loading = false
  export let crumbs: {
    href?: string
    name: string
  }[] = []
</script>

<nav aria-label="breadcrumbs">
  <ol class="flex py-2 text-sm font-light text-gray-500">
    {#if loading}
      <div class=" h-5 w-32 animate-pulse rounded bg-gray-200"></div>
    {:else}
      <li>
        <a href="/">Argasso</a>
      </li>
      {#each crumbs as { href, name }}
        <li class="breadcrumb-items overflow-hidden text-ellipsis">
          <a class="whitespace-nowrap first-letter:uppercase" {href}>{name}</a>
        </li>
      {/each}
    {/if}
  </ol>
</nav>

<style>
  li + li:before {
    content: '/';
    padding: 0 0.3rem;
  }
</style>
