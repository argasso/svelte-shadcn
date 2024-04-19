<script lang="ts">
  import { type ArgassoFilter } from './shopifyFilters'
  import ListFilterItem from './ListFilterItem.svelte'

  export let filter: ArgassoFilter
  let size = 10
  let value = ''
  $: filtered = filter.values.filter((v) => v.label.toLowerCase().includes(value.toLowerCase())).map((v) => v.value)
  $: visible = filtered.slice(0, size)
</script>

{#if filter.values.length > 10}
  <input placeholder="Sök..." class="text-xs" type="text" bind:value />
{/if}
<ul>
  {#each filter.values as param}
    <ListFilterItem class={visible.includes(param.value) ? '' : 'hidden'} {param} />
  {/each}
</ul>
{#if filtered.length > size}
  <div class="m-2 text-xs italic">
    {filter.values.length - size} alternativ visas inte.
    <button
      class="italic text-argasso-600"
      on:click={() => {
        size += 10
      }}>Klicka för fler.</button
    >
  </div>
{/if}
