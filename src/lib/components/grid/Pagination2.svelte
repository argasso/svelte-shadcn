<script context="module">
</script>

<script lang="ts">
  import { getSingleValueQueryStore } from '$lib/stores/URLSearchParamsStore'
  import * as Pagination from '$lib/components/ui/pagination'

  let className = ''
  export { className as class }
  export let count: number
  export let perPage: number

  // const pageStore = getSingleValueQueryStore('page')
  // $: page = (parseInt($pageStore) || 1) - 1

  // $: pageCount = Math.floor(pageing.count / pageing.size)
  // $: {
  //   if (page > pageCount) {
  //     gotoPage(0)
  //   }
  // }

  // function gotoPage(page: number) {
  //   const pageString = page === 0 ? '' : (page + 1).toString()
  //   pageStore.set(pageString)
  // }
</script>

<Pagination.Root {count} {perPage} let:pages let:currentPage>
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.PrevButton />
    </Pagination.Item>
    {#each pages as page (page.key)}
      {#if page.type === 'ellipsis'}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
      {:else}
        <Pagination.Item isVisible={currentPage == page.value}>
          <Pagination.Link {page} isActive={currentPage == page.value}>
            {page.value}
          </Pagination.Link>
        </Pagination.Item>
      {/if}
    {/each}
    <Pagination.Item>
      <Pagination.NextButton />
    </Pagination.Item>
  </Pagination.Content>
</Pagination.Root>

<style lang="postcss">
  .active {
    @apply bg-primary;
    @apply border-red-900;
    color: white;
  }

  .disabled {
    @apply text-gray-400;
    @apply bg-gray-100;
    cursor: default;
  }

  button {
    cursor: pointer;
  }
</style>
