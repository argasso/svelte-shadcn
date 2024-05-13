<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui'
  import ChevronDown from 'svelte-radix/ChevronDown.svelte'
  import { cn } from '$lib/utils.js'

  type $$Props = AccordionPrimitive.TriggerProps
  type $$Events = AccordionPrimitive.TriggerEvents

  let className: $$Props['class'] = undefined
  export let level: AccordionPrimitive.HeaderProps['level'] = 3
  export { className as class }
</script>

<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    class={cn(
      'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline',
      '[&[data-state=open]_.left]:-rotate-45 [&[data-state=open]_.right]:rotate-45',
      className,
    )}
    {...$$restProps}
    on:click
  >
    <slot />
    <div class="flex h-6 w-6">
      <div class="flex items-center overflow-hidden">
        <span
          class={cn([
            'h-0 w-3 border border-card-foreground bg-card-foreground transition-transform duration-200',
            'left translate-x-[3px] rotate-45 rounded-l-full',
          ])}
        ></span>
      </div>
      <div class="flex items-center overflow-hidden">
        <span
          class={cn([
            'h-0 w-3 border border-card-foreground bg-card-foreground transition-transform duration-200',
            'right -translate-x-[3px] -rotate-45 rounded-r-full',
          ])}
        ></span>
      </div>
    </div>

    <!-- <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" /> -->
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
