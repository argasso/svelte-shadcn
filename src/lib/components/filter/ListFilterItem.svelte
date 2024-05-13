<script lang="ts">
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'
  import { slide } from 'svelte/transition'
  import type { ArgassoFilterItem } from './shopifyFilters'
  import ReadingLevel from '../ReadingLevel.svelte'

  let className = ''
  export { className as class }
  export let param: ArgassoFilterItem
  // export let countById: Map<string, number>

  $: ({ label, value, children = [], count, key, id } = param)
  // $: updatedCount = countById?.get(id ?? '') ?? count
  $: updatedCount = count

  const query = getQueryStore(param.key)

  $: checked = $query.includes(value)

  function handleChange(event: any) {
    const { name, checked } = event.target as HTMLInputElement
    if (checked) {
      query.update((values) => [...values, name])
    } else {
      query.update((values) => {
        const newValues = values.filter((v) => !v.startsWith(value))
        return newValues
      })
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
    <!-- <span class="overflow-x-hidden pl-0 text-sm font-light "> -->
    {#if key === 'vm.book.reading_level'}
      <ReadingLevel level={parseInt(label)} />
    {:else}
      <span class="pl-1">
        {label}
      </span>
    {/if}
    {#if !checked}
      <span class="ml-auto rounded-full bg-gray-400 px-2 py-1 text-xs leading-none text-gray-50"
        >{updatedCount}</span
      >
    {/if}
    <!-- </span> -->
  </label>
  {#if checked && children.length > 0}
    <ul class="mb-0 ml-4 list-none border-l-2 border-primary pl-2" transition:slide>
      {#each children as childParam}
        <svelte:self param={childParam} />
      {/each}
    </ul>
  {/if}
</li>
