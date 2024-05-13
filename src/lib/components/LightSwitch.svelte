<script lang="ts">
  import Sun from 'svelte-radix/Sun.svelte'
  import Moon from 'svelte-radix/Moon.svelte'
  import { resetMode, setMode } from 'mode-watcher'
  import { Button } from '$lib/components/ui/button'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import { Star } from 'svelte-radix'
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="ghost"
      size="icon"
      class="flex-none bg-transparent hover:bg-white/10 hover:text-white"
    >
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Ändra theme</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item class="gap-2" on:click={() => setMode('light')}>
      <Sun size="20" /> Ljust tema
    </DropdownMenu.Item>
    <DropdownMenu.Item class="gap-2" on:click={() => setMode('dark')}>
      <Moon size="20" /> Mörkt tema
    </DropdownMenu.Item>
    <DropdownMenu.Item class="gap-2" on:click={() => resetMode()}>
      <div class="grid">
        <Moon class="moon col-start-1 row-start-1" size="20" />
        <Sun class="sun col-start-1 row-start-1" size="20" />
        <div
          class="col-start-1 row-start-1 -ml-1 h-[1px] w-7 rotate-45 self-center rounded-full bg-current"
        ></div>
      </div>
      Systemstandard
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<style lang="postcss">
  :global(.moon) {
    clip-path: polygon(0 0, 0% 100%, 100% 100%);
  }
  :global(.sun) {
    clip-path: polygon(0 0, 100% 0, 100% 100%);
  }
</style>
