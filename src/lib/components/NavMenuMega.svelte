<script lang="ts">
  import { page } from '$app/stores'
  import Button from './ui/button/button.svelte'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
  import { ChevronDown } from 'svelte-radix'
  import NavMenuMegaItem from './NavMenuMegaItem.svelte'
  import Separator from './ui/separator/separator.svelte'
  import DropdownMenuLabel from './ui/dropdown-menu/dropdown-menu-label.svelte'
  import type { MenuItem } from '$lib/menu'

  export let menuItem: MenuItem
  export let exact = false
  $: active =
    $page.url.pathname && menuItem.href && exact
      ? $page.url.pathname === menuItem.href
      : $page.url.pathname.includes(menuItem.href)
  let open = false
  const shortcuts = [
    {
      label: 'Välj',
      codes: ['&crarr;'],
    },
    {
      label: 'Upp/Ned',
      codes: ['&darr;', '&uarr;'],
    },
    {
      label: 'Submeny',
      codes: ['&larr;', '&rarr;'],
    },
  ]
</script>

<!-- <Button
  variant="link"
  class={`text-md group mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent px-1  text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
  href={menuItem.href}
>
  <span class="my-auto">{menuItem.name}</span>
  <div
    class="invisible fixed top-12 z-0 flex flex-col bg-card shadow-lg hover:visible focus:visible group-hover:visible group-focus:visible"
  >
    {#each menuItem.children as child}
      <a href={child.href}>{child.name}</a>
    {/each}
  </div>
</Button> -->

<div class="flex items-stretch font-sans">
  <Button
    variant="link"
    class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent px-1  text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
    href={menuItem.href}
  >
    <span class="my-auto">{menuItem.name}</span>
  </Button>
  {#if menuItem.children.length > 0}
    <DropdownMenu.Root bind:open disableFocusFirstItem={true}>
      <DropdownMenu.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="ghost"
          size="icon"
          class="w-5 flex-none self-center bg-transparent hover:bg-white/10 hover:text-white"
        >
          <ChevronDown size="16" /> <span class="sr-only">Ändra theme</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="mt-2 min-w-44 p-2 font-sans">
        {#each menuItem.children as child}
          <NavMenuMegaItem menuItem={child} bind:open></NavMenuMegaItem>
        {/each}
        <DropdownMenu.Separator />
        <DropdownMenuLabel class="hidden items-start gap-2 sm:flex">
          {#each shortcuts as { label, codes }, index}
            {#if index > 0}
              <Separator orientation="vertical" />
            {/if}
            <div class="flex items-center gap-1">
              <span class="text-xs font-light text-muted-foreground">{label}</span>
              {#each codes as code}
                <kbd
                  class="pointer-events-none hidden h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono font-medium text-muted-foreground opacity-100 sm:flex"
                >
                  {@html code}
                </kbd>
              {/each}
            </div>
          {/each}
        </DropdownMenuLabel>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</div>

<!-- <Popover.Root group="mega" open={menuItem.name === 'Information'}>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="link"
      class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
      builders={[builder]}
      href={menuItem.href}
    >
      <span class="my-auto">{menuItem.name}</span>
    </Button>
  </Popover.Trigger>
  <Popover.Content>
    <p>asdf</p>
    <div class="flex flex-col">
      {#each menuItem.children as child}
        <a href={child.href}>{child.name}</a>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root> -->

<!-- <Dialog.Root >
  <Dialog.Trigger>Edit Profile</Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">Name</div>
      <div class="grid grid-cols-4 items-center gap-4">Username</div>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root> -->

<!-- <Tooltip.Root
  openDelay={0}
  group="mega"
  open={menuItem.name === 'Information'}
  disableHoverableContent={false}
>
  <Tooltip.Trigger asChild let:builder>
    <Button
      variant="link"
      class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
      builders={[builder]}
      href={menuItem.href}
    >
      <span class="my-auto">{menuItem.name}</span>
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content strategy="fixed" fitViewport class="">
    <div class="flex flex-col">
      {#each menuItem.children as child}
        <a href={child.href}>{child.name}</a>
      {/each}
    </div>
  </Tooltip.Content>
</Tooltip.Root> -->
