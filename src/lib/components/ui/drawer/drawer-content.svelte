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
      'fixed z-50 flex border bg-background p-1',
      direction === 'bottom'
        ? 'bottom-0 left-0 right-0 h-[75%] flex-col rounded-t-[10px] md:h-[50%]'
        : '',
      direction === 'top'
        ? 'left-0 right-0 top-0 h-[75%] flex-col rounded-b-[10px] md:h-[50%]'
        : '',
      direction === 'left'
        ? 'bottom-0 left-0 top-0 w-[90%] flex-row rounded-r-[10px] sm:w-[70%] md:w-[60%] lg:w-[50%]'
        : '',
      direction === 'right'
        ? 'bottom-0 right-0 top-0 w-[90%] flex-row rounded-l-[10px] sm:w-[70%] md:w-[60%] lg:w-[50%]'
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
        direction === 'right' ? 'flex-row ' : '',
      )}
    >
      <div
        class={cn(
          'rounded-full bg-zinc-300',
          direction === 'top' || direction === 'bottom' ? 'mx-auto h-1.5 w-12' : '',
          direction === 'left' || direction === 'right' ? 'my-auto h-12 w-1.5' : '',
        )}
      />
      <DrawerPrimitive.Close asChild let:builder>
        <Button
          builders={[builder]}
          variant="ghost"
          size="icon"
          class="absolute right-4 top-4 rounded-full"
          ><Cross2 />
          <span class="sr-only">Close</span>
        </Button>
      </DrawerPrimitive.Close>

      <div class="h-full w-full p-2 sm:p-6">
        <slot />
      </div>
    </div>
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
