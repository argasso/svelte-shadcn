<script lang="ts">
  import Cross2 from 'svelte-radix/Cross2.svelte'
  import Button from '../ui/button/button.svelte'
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'
  import { getDecendants, type EnhancedFilterItem } from './shopifyFilters'

  export let filter: EnhancedFilterItem

  const query = getQueryStore(filter.key)
  $: label = getLabel(filter)

  $: decendantValues = getDecendants(filter).map((i) => i.value)

  function getLabel(filter: EnhancedFilterItem) {
    switch (filter.filterType) {
      case 'PRICE_RANGE':
        return `${filter.label} ${filter.value.replace('.', ' - ')}`
      case 'BOOLEAN':
        return `${filter.filterLabel} ${filter.label}`
      default:
        return filter.key === 'reading_level'
          ? `${filter.filterLabel} ${filter.label}`
          : filter.label
    }
  }

  function remove() {
    if (filter.filterType === 'PRICE_RANGE') {
      query.update(() => [])
    } else {
      query.update((values) => values.filter((v) => !decendantValues.includes(v)))
    }
  }
</script>

<Button on:click={remove}>
  {label}
  <Cross2 class="rounded-full opacity-40" size="16" />
</Button>
