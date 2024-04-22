<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui'
  import Cross2 from 'svelte-radix/Cross2.svelte'
  import * as Dialog from './index.js'
  import { cn, flyAndScale } from '$lib/utils.js'
  import Button from '../button/button.svelte'

  type $$Props = DialogPrimitive.ContentProps

  let className: $$Props['class'] = undefined
  export let transition: $$Props['transition'] = flyAndScale
  export let transitionConfig: $$Props['transitionConfig'] = {
    duration: 200,
  }
  export { className as class }
</script>

<Dialog.Portal>
  <Dialog.Overlay color="black" />
  <DialogPrimitive.Content
    {transition}
    {transitionConfig}
    class={cn(
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg dark:bg-slate-700 sm:rounded-lg md:w-full',
      className,
    )}
    {...$$restProps}
  >
    <slot />
    <DialogPrimitive.Close asChild let:builder>
      <Button
        builders={[builder]}
        variant="ghost"
        size="icon"
        class="absolute right-1.5 top-1.5 rounded-full"
        ><Cross2 />
        <span class="sr-only">Close</span>
      </Button>
    </DialogPrimitive.Close>
  </DialogPrimitive.Content>
</Dialog.Portal>
