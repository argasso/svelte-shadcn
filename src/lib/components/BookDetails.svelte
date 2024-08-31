<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import Pill from './Pill.svelte'
  import ReadingLevel from './ReadingLevel.svelte'

  export let details: {
    key: string
    label: string
    value: string
  }[] = []
</script>

<Card.Root>
  <!-- <Card.Header>
		<Card.Title>Detaljer</Card.Title>
	</Card.Header> -->
  <Card.Content class="p-0">
    <dl>
      {#each details as item, index}
        <div class:odd={index % 2 === 0} class="grid grid-cols-3 gap-4 p-6 py-2">
          <dt class="overflow-hidden text-ellipsis text-sm font-medium">
            {item.label}
          </dt>
          <dd class="col-span-2 text-sm">
            {#if item.key === 'reading_level'}
              <ReadingLevel level={parseInt(item.value)} />
            {:else}
              {item.value}
            {/if}
          </dd>
        </div>
      {/each}
    </dl>
  </Card.Content>
</Card.Root>

<style lang="postcss">
  .odd {
    background-color: hsl(var(--background) / 50%);
  }
</style>
