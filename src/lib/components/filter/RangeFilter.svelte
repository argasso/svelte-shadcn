<script lang="ts">
  import { Slider } from '$lib/components/ui/slider'
  import type { ArgassoFilter } from './shopifyFilters'
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'

  export let filter: ArgassoFilter

  const key = filter.values.at(0)?.key ?? 'price'
  const query = getQueryStore(key)

  const [min, max] = filter.values.map((v) => parseFloat(v.value))

  let range = $query?.length === 2 ? $query?.map((v) => parseFloat(v)) : [min, max]
  $: console.log('$query', $query)

  let timer: NodeJS.Timeout

  $: unset = range[0] === min && range[1] === max
  $: range && debouncedQuery()
  $: $query?.length !== 2 && resetRange()

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
  <div class="flex justify-between">
    <div>
      <label class="text-sm font-light" for={`${filter.id}-min`}>som lägst</label>
      <input
        class="h-8 w-20 rounded"
        type="number"
        name="min"
        id={`${filter.id}-min`}
        bind:value={range[0]}
      />
    </div>
    <div>
      <label class="text-sm font-light" for={`${filter.id}-max`}>som högst</label>
      <input
        class="h-8 w-20 rounded"
        type="number"
        name="max"
        id={`${filter.id}-max`}
        bind:value={range[1]}
      />
    </div>
  </div>
  <div class:unset class="p-2">
    <Slider
      bind:value={range}
      {min}
      {max}
      step={1}
      on:change={(v) => console.log('slider change', v)}
    />
    <!-- <RangeSlider bind:values={range} on:stop={stop} {min} {max} range pushy /> -->
  </div>
</div>
