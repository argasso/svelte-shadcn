<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
  import { HamburgerMenu } from 'svelte-radix'
  import NavMenu from './NavMenu.svelte'
  import type { MenuItem } from '../../routes/+layout.svelte'
  import ScrollArea from './ui/scroll-area/scroll-area.svelte'

  export let menuItems: MenuItem[]
</script>

<Drawer.Root shouldScaleBackground={false} direction="left">
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <HamburgerMenu />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="left" class="flex justify-center">
    <div class="flex h-full flex-1 justify-center">
      <ScrollArea class="h-full w-full max-w-md py-0">
        <NavMenu class="w-full" {menuItems}></NavMenu>
      </ScrollArea>
    </div>
  </Drawer.Content>
</Drawer.Root>
