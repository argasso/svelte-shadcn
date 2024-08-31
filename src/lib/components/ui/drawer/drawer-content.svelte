<script lang="ts">
  import { Drawer as DrawerPrimitive, type DrawerDirection } from 'vaul-svelte'
  import DrawerOverlay from './drawer-overlay.svelte'
  import { cn } from '$lib/utils.js'
  import Button from '../button/button.svelte'
  import { Cross2 } from 'svelte-radix'

  type $$Props = DrawerPrimitive.ContentProps & {
    direction?: DrawerDirection
  }

  let className: $$Props['class'] = undefined
  export { className as class }
  export let direction: DrawerDirection = 'bottom'
</script>

<DrawerPrimitive.Portal>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    class={cn(
      'fixed z-50 flex border bg-background p-0',
      direction === 'bottom'
        ? 'bottom-0 left-0 right-0 h-[90%] flex-col rounded-t-[10px] md:h-[50%]'
        : '',
      direction === 'top'
        ? 'left-0 right-0 top-0 h-[90%] flex-col rounded-b-[10px] md:h-[50%]'
        : '',
      direction === 'left'
        ? 'bottom-0 left-0 top-0 w-[90%] max-w-md flex-row-reverse rounded-r-[10px]'
        : '',
      direction === 'right'
        ? 'bottom-0 right-0 top-0 w-[90%] max-w-md flex-row rounded-l-[10px]'
        : '',
      className,
    )}
    {...$$restProps}
  >
    <div
      class={cn(
        'flex h-full w-full rounded-full',
        direction === 'bottom' ? 'flex-col' : '',
        direction === 'top' ? 'flex-col-reverse' : '',
        direction === 'left' ? 'flex-row-reverse' : '',
        direction === 'right' ? 'flex-row' : '',
      )}
    >
      <div
        class={cn(
          'absolute rounded-full bg-background opacity-50',
          direction === 'top' || direction === 'bottom' ? 'left-0 right-0 mx-auto h-1.5 w-20' : '',
          direction === 'top' ? '-bottom-3' : '',
          direction === 'bottom' ? '-top-3' : '',
          direction === 'left' || direction === 'right' ? 'bottom-0 top-0 my-auto h-20 w-1.5' : '',
          direction === 'left' ? '-right-3' : '',
          direction === 'right' ? '-left-3' : '',
        )}
      />
      <DrawerPrimitive.Close asChild let:builder>
        <Button
          builders={[builder]}
          variant="ghost"
          size="icon"
          class={cn(
            'absolute rounded-full',
            direction === 'top' ? 'right-2.5 top-2.5' : '',
            direction === 'bottom' ? 'right-2.5' : 'top-2.5',
            direction === 'right' ? 'right-5 top-2.5' : '',
            direction === 'left' ? 'left-5' : 'top-2.5',
          )}
          ><Cross2 />
          <span class="sr-only">Close</span>
        </Button>
      </DrawerPrimitive.Close>

      <div class="h-full w-full">
        <slot />
      </div>
    </div>
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
