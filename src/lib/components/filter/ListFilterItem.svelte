<script lang="ts">
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'
  import { slide } from 'svelte/transition'
  import ReadingLevel from '../ReadingLevel.svelte'
  import { getDecendants, type EnhancedFilterItem } from './shopifyFilters'

  let className = ''
  export { className as class }
  export let key: string
  export let item: EnhancedFilterItem

  const query = getQueryStore(key)

  $: ({ label, value, count, children = [] } = item)
  $: checked = $query.includes(value)
  $: decendantValues = getDecendants(item).map((i) => i.value)

  function handleChange(event: any) {
    const { name, checked } = event.target as HTMLInputElement
    if (checked) {
      query.update((values) => [...values, name])
    } else {
      query.update((values) => values.filter((v) => !decendantValues.includes(v)))
    }
  }
</script>

<li class={className}>
  <label class="flex items-center text-sm">
    <input
      type="checkbox"
      name={value}
      value={checked}
      class="m-1 h-6 w-6 rounded-sm text-primary"
      on:change={handleChange}
      bind:checked
    />
    {#if key === 'reading_level'}
      <ReadingLevel level={parseInt(label)} />
    {:else}
      <span class="pl-1">
        {label}
      </span>
    {/if}
    {#if !checked}
      <span class="ml-auto rounded-full bg-gray-400 px-2 py-1 text-xs leading-none text-gray-50"
        >{count}</span
      >
    {/if}
  </label>
  {#if checked && children.length > 0}
    <ul class="mb-0 ml-4 list-none border-l-2 border-primary pl-2" transition:slide>
      {#each children as child}
        <svelte:self {key} item={child} />
      {/each}
    </ul>
  {/if}
</li>
