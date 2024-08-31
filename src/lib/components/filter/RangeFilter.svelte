<script lang="ts">
  import { Slider } from '$lib/components/ui/slider'
  import { getShortKey, isPrice, type EnhancedFilter } from './shopifyFilters'
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'
  import type { ProductFilter } from '$houdini'

  export let filter: EnhancedFilter

  const key = getShortKey(filter.id) ?? 'price'
  const query = getQueryStore(key)

  $: parsed = JSON.parse(filter.values[0].input) as ProductFilter
  $: initialRange = isPrice(parsed) ? parsed.price : { min: 0, max: 300 }
  let min: number
  $: min = min ?? initialRange.min
  let max: number
  $: max = max ?? initialRange.max

  let range = $query?.length === 2 ? $query?.map((v) => parseFloat(v)) : [min, max]

  $: unset = range[0] === min && range[1] === max
  $: range && debouncedQuery()
  $: $query?.length !== 2 && resetRange()

  let timer: NodeJS.Timeout

  function debouncedQuery() {
    clearTimeout(timer)
    timer = setTimeout(setQuery, 500)
  }

  function setQuery() {
    if (unset) {
      $query = []
    } else {
      $query = [...range.map(String)]
    }
    console.log('setQuery', $query, range, unset)
  }

  function resetRange() {
    console.log('resetRange')

    if (!range.includes(min) || !range.includes(max)) {
      range = [min, max]
    }
  }
</script>

<div class="pb-2">
  <div class:unset class="p-2">
    <Slider
      bind:value={range}
      {min}
      {max}
      step={1}
      on:change={(v) => console.log('slider change', v)}
    />
  </div>
  <div class="flex justify-between">
    <div class="w-20">
      <label class="text-sm font-light" for={`${filter.id}-min`}>som lägst</label>
      <input
        data-vaul-no-drag
        class="h-8 w-20 rounded"
        type="number"
        name="min"
        id={`${filter.id}-min`}
        bind:value={range[0]}
      />
    </div>
    <div class="w-20">
      <label class="text-sm font-light" for={`${filter.id}-max`}>som högst</label>
      <input
        data-vaul-no-drag
        class="h-8 w-20 rounded"
        type="number"
        name="max"
        id={`${filter.id}-max`}
        bind:value={range[1]}
      />
    </div>
  </div>
</div>
