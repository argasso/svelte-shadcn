<script lang="ts">
  import { onMount } from 'svelte'
  import * as Command from '$lib/components/ui/command'
  import { Button } from '$lib/components/ui/button'
  import { cn } from '$lib/utils.js'
  import { goto } from '$app/navigation'
  import { PredictiveSearchStore, type PredictiveSearch$result } from '$houdini'
  import { bookUrl } from '$lib'
  import ShopifyImage from './ShopifyImage.svelte'
  import Separator from '../ui/separator/separator.svelte'
  import { MagnifyingGlass } from 'svelte-radix'

  export { className as class }
  let className: string = ''
  let open = false

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open = true
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  function runCommand(cmd: () => void) {
    open = false
    cmd()
  }

  const search = new PredictiveSearchStore()

  let searchTerm = ''
  let results: NonNullable<PredictiveSearch$result['predictiveSearch']>['products'] = []

  async function onInput(query: string) {
    if (searchTerm.length) {
      const response = await search.fetch({
        variables: { query },
        policy: 'CacheAndNetwork',
      })
      results = response.data?.predictiveSearch?.products || []
    } else {
      results = []
    }
  }

  $: onInput(searchTerm)

  const shortcuts = [
    {
      label: 'Välj',
      code: '&crarr;',
    },
    {
      label: 'Nästa träff',
      code: '&darr;',
    },
    {
      label: 'Föregående träff',
      code: '&uarr;',
    },
  ]
</script>

<Button
  variant="outline"
  class={cn(
    'relative hidden justify-start text-sm text-muted-foreground sm:inline-flex sm:w-40',
    className,
  )}
  on:click={() => (open = true)}
  {...$$restProps}
>
  <MagnifyingGlass class="h-4 w-4 opacity-50" />
  <span class="hidden sm:inline-flex">Sök...</span>
  <kbd
    class="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
  >
    <span class="text-xs">⌘</span>K
  </kbd>
</Button>
<Button
  variant="header"
  size="icon"
  class="relative flex-none sm:hidden"
  on:click={() => (open = true)}
  {...$$restProps}
>
  <MagnifyingGlass />
</Button>
<Command.Dialog bind:open shouldFilter={false}>
  <Command.Input placeholder="Sök titel" bind:value={searchTerm} />
  <Command.List>
    <Command.Empty>
      {#if searchTerm.length > 0}
        Hittar ingenting som motsvarar sökningen.
      {:else}
        Skriv något att söka efter
      {/if}
    </Command.Empty>
    {#if results.length > 0}
      <Command.Group heading={`Hittade ${results.length} böcker`}>
        {#each results as product}
          <Command.Item
            class="flex gap-4 text-accent-foreground  aria-selected:text-foreground"
            value={product.handle}
            onSelect={() =>
              runCommand(() => {
                product.handle && goto(bookUrl(product.handle))
              })}
          >
            <ShopifyImage image={product.images.nodes[0]} height={40} />
            {product.title}
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}
  </Command.List>
  <Separator />
  <div class="hidden items-start gap-4 p-3 sm:flex">
    {#each shortcuts as { label, code }, index}
      {#if index > 0}
        <Separator orientation="vertical" />
      {/if}
      <div class="flex gap-2">
        <span class="text-sm text-muted-foreground">{label}</span>
        <kbd
          class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium text-muted-foreground opacity-100 sm:flex"
        >
          {@html code}
        </kbd>
      </div>
    {/each}
  </div>
</Command.Dialog>
