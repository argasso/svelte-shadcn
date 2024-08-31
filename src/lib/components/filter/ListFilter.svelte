<script lang="ts">
  import { getShortValue, type EnhancedFilter } from './shopifyFilters'
  import ListFilterItem from './ListFilterItem.svelte'

  export let filter: EnhancedFilter

  let size = 10
  let value = ''
  $: filtered = filter.values
    .filter((v) => v.label.toLowerCase().includes(value.toLowerCase()))
    .map(getShortValue)
  $: visible = filtered.slice(0, size)
</script>

{#if filter.values.length > 10}
  <input placeholder="Sök..." class="text-xs" type="text" bind:value />
{/if}
<ul>
  {#each filter.values as item}
    <ListFilterItem
      class={visible.includes(getShortValue(item)) ? '' : 'hidden'}
      key={filter.key}
      {item}
    />
  {/each}
</ul>
{#if filtered.length > size}
  <div class="m-2 text-xs italic">
    {filter.values.length - size} alternativ visas inte.
    <button
      class="italic text-primary"
      on:click={() => {
        size += 10
      }}>Klicka för fler.</button
    >
  </div>
{/if}
