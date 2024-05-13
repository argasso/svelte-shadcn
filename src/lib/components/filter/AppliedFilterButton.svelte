<script lang="ts">
  import type { ProductFilter, Products$result } from '$houdini'
  import Button from '../ui/button/button.svelte'

  export let filters: NonNullable<Products$result['collection']>['products']['filters'] | null
  export let appliedFilter: ProductFilter
</script>

<Button></Button>
