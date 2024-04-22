<script lang="ts">
  import { isMenuOpen } from '$lib/stores/store'

  import { slide, fade } from 'svelte/transition'
  import ExpandToggle from './ExpandToggle.svelte'
  import type { MenuItem } from '../../../routes/+layout'

  export let menuItem: MenuItem

  $: ({ name, href, children } = menuItem)

  let open = false
  let onClick = (): void => {
    $isMenuOpen = false
  }
</script>

<li class="border-b border-[color:var(--menu-border-color)]">
  <div class="flex" class:open>
    <a class="flex-grow py-4" {href} on:click={onClick}>
      {name}
    </a>
    {#if children.length}
      <ExpandToggle bind:open />
    {/if}
  </div>
  {#if children.length && open}
    <div class="border-t border-[color:var(--menu-border-color)]" transition:fade>
      <ul
        class="m-0 list-none border-l-4 border-[color:var(--menu-accent-color)] p-0 pl-3.5"
        transition:slide
      >
        {#each children as child}
          <svelte:self menuItem={child} />
        {/each}
      </ul>
    </div>
  {/if}
</li>

<style>
  li:last-child {
    border: none;
  }
</style>
