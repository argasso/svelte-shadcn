<script lang="ts">
  import { slide, fade } from 'svelte/transition'
  import ExpandButton from './filter/ExpandButton.svelte'
  import { Close } from './ui/drawer'
  import type { MenuItem } from '$lib/menu'

  export let menuItem: MenuItem

  $: ({ name, href, children } = menuItem)

  let open = false
</script>

<li class="border-b border-border">
  <div class="flex items-center" class:open>
    <Close class="" asChild let:builder>
      <a class="flex-grow py-4" {href} use:builder.action {...builder}>
        {name}
      </a>
    </Close>
    {#if children.length}
      <ExpandButton bind:open />
    {/if}
  </div>
  {#if children.length && open}
    <div class="border-t border-border" transition:fade>
      <ul class="m-0 list-none border-l-4 border-primary p-0 pl-3.5" transition:slide>
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
