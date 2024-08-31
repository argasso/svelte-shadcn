<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
  import { HamburgerMenu } from 'svelte-radix'
  import NavMenu from './NavMenu.svelte'
  import ScrollArea from './ui/scroll-area/scroll-area.svelte'
  import type { MenuItem } from '$lib/menu'
  import Separator from './ui/separator/separator.svelte'

  export let menu: MenuItem
</script>

<Drawer.Root shouldScaleBackground={false} direction="left">
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <HamburgerMenu />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="left">
    <div class="flex h-full flex-col">
      <Drawer.Header class="flex-0 h-14 w-full items-center border-b p-0 sm:text-center">
        <h2 class="m-0 text-lg font-semibold">Meny</h2>
      </Drawer.Header>

      <ScrollArea class="h-full flex-1 px-8">
        <NavMenu {menu}></NavMenu>
      </ScrollArea>
    </div>
  </Drawer.Content>
</Drawer.Root>
