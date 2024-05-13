<script lang="ts">
  import { cn } from '$lib/utils'
  import { createEventDispatcher } from 'svelte'
  import Button from '../ui/button/button.svelte'

  const dispatch = createEventDispatcher<{ toggle: boolean }>()

  export let open = false
  export let ariaLabel = 'expand sub menu'

  function onClick(e: MouseEvent) {
    e.stopPropagation()
    open = !open
    dispatch('toggle', open)
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class="flex items-center justify-center"
  on:click={onClick}
  aria-expanded={open}
  aria-label={ariaLabel}
>
  <div class="flex h-6 w-6">
    <div class="flex items-center overflow-hidden">
      <span
        class={cn([
          'h-0 w-3 border border-current bg-current transition-transform duration-300 ease-linear',
          'translate-x-[3px] rotate-45 rounded-l-full',
          open && '-rotate-45',
        ])}
      ></span>
    </div>
    <div class="flex items-center overflow-hidden">
      <span
        class={cn([
          'h-0 w-3 border border-current bg-current transition-transform duration-300 ease-linear',
          '-translate-x-[3px] -rotate-45 rounded-r-full',
          open && 'rotate-45',
        ])}
      ></span>
    </div>
  </div>
</Button>
