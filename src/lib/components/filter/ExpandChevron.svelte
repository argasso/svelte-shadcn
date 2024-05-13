<script lang="ts">
  import { cn } from '$lib/utils'

  export let expanded = false
</script>

<div class="flex h-6 w-6">
  <div class="flex items-center overflow-hidden">
    <span
      class={cn([
        'h-0 w-3 border border-current bg-current transition-transform duration-300 ease-linear',
        'translate-x-[3px] rotate-45 rounded-l-full',
        expanded && '-rotate-45',
      ])}
    ></span>
  </div>
  <div class="flex items-center overflow-hidden">
    <span
      class={cn([
        'h-0 w-3 border border-current bg-current transition-transform duration-300 ease-linear',
        '-translate-x-[3px] -rotate-45 rounded-r-full',
        expanded && 'rotate-45',
      ])}
    ></span>
  </div>
</div>
