<script lang="ts">
  import Plus from 'svelte-radix/Plus.svelte'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
</script>

<Drawer.Root shouldScaleBackground={false} direction={'right'}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon" class="relative flex-none">
      <Plus />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="right" class="flex justify-center"></Drawer.Content>
</Drawer.Root>
