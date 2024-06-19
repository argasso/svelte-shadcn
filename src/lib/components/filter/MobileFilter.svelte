<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
  import Filters from './Filters.svelte'
  import ScrollArea from '../ui/scroll-area/scroll-area.svelte'
  import type { EnhancedFilter } from './shopifyFilters'

  let className = ''
  export { className as class }
  // export let filters: NonNullable<Products$result['collection']>['products']['filters'] | null
  // export let appliedFilters: ProductFilter[]
  // export let categoryId: string | undefined = undefined

  export let filters: EnhancedFilter[]
</script>

<Drawer.Root shouldScaleBackground={false} direction="bottom">
  <Drawer.Trigger asChild let:builder>
    <Button class={className} builders={[builder]} variant="outline">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M11.058 17q-.213 0-.357-.144q-.143-.144-.143-.357q0-.212.143-.356t.357-.143h1.865q.213 0 .356.144t.144.357t-.144.356t-.356.143zm-3.75-4.5q-.213 0-.357-.144q-.143-.144-.143-.357t.143-.356t.357-.143h9.365q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zM4.5 8q-.213 0-.356-.144T4 7.499t.144-.356T4.5 7h15q.213 0 .356.144q.144.144.144.357q0 .212-.144.356T19.5 8z"
        /></svg
      >
      Urval
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="bottom" class="flex justify-center">
    <div class="mx-auto flex h-full max-w-md flex-col gap-4">
      <ScrollArea class="min-h-0 flex-1 rounded-md border p-0">
        <div class="mx-auto max-w-md justify-center">
          <Filters class="w-full" {filters}></Filters>
        </div>
      </ScrollArea>
    </div>
  </Drawer.Content>
</Drawer.Root>
