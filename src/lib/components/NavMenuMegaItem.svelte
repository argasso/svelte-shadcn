<script lang="ts">
  import { goto } from '$app/navigation'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
  import type { MenuItem } from '$lib/menu'
  import Button from './ui/button/button.svelte'
  import type { CustomEventHandler } from 'bits-ui'

  export let menuItem: MenuItem
  export let open = false

  $: ({ href, name, children } = menuItem)

  function onKeydown(e: CustomEventHandler<KeyboardEvent, HTMLDivElement>) {
    const event = e.detail.originalEvent
    if (event.repeat) return
    if (event.key === 'Enter') {
      open = false
      e.preventDefault()
      goto(href)
    }
  }
  function onClick(e: CustomEventHandler<MouseEvent, HTMLDivElement>) {
    const event = e.detail.originalEvent
    if (event.isTrusted) {
      open = false
      e.preventDefault()
    }
  }
</script>

{#if children.length > 0}
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger on:keydown={onKeydown} on:click={onClick}>
      <a {href} class="inline-block flex-grow">{name}</a>
      <!-- <Button {href} variant="link" builders={[builder]}>{name}</Button> -->
      <!-- <DropdownMenu.Item {...builder} {href}>{name}</DropdownMenu.Item> -->
      <!-- <Button
        builders={[builder]}
        class="h-auto p-0 text-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
        variant="link"
        tabindex={-1}
        on:click={() => (open = false)}
        {href}>{name}</Button
      > -->
    </DropdownMenu.SubTrigger>
    <DropdownMenu.SubContent sideOffset={5} class="min-w-44 p-2">
      {#each children as child}
        <svelte:self menuItem={child} bind:open />
      {/each}
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
{:else}
  <DropdownMenu.Item {href}>{name}</DropdownMenu.Item>
{/if}
