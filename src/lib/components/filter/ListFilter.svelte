<script lang="ts">
  import { type ArgassoFilter, type ArgassoFilterItem } from './shopifyFilters'
  import ListFilterItem from './ListFilterItem.svelte'

  export let values: ArgassoFilterItem[]
  // export let countById: Map<string, number>

  let size = 10
  let value = ''
  $: filtered = values
    .filter((v) => v.label.toLowerCase().includes(value.toLowerCase()))
    .map((v) => v.value)
  $: visible = filtered.slice(0, size)
</script>

{#if values.length > 10}
  <input placeholder="Sök..." class="text-xs" type="text" bind:value />
{/if}
<ul>
  {#each values as param}
    <ListFilterItem class={visible.includes(param.value) ? '' : 'hidden'} {param} />
  {/each}
</ul>
{#if filtered.length > size}
  <div class="m-2 text-xs italic">
    {values.length - size} alternativ visas inte.
    <button
      class="text-argasso-600 italic"
      on:click={() => {
        size += 10
      }}>Klicka för fler.</button
    >
  </div>
{/if}
