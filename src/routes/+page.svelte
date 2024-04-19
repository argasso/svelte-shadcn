<script lang="ts">
  import Hero2 from '$lib/components/Hero2.svelte'
  import SektionBokgalleri from '$lib/components/SektionBokgalleri.svelte'
  import type { PageData } from './$houdini'

  export let data: PageData

  $: ({ page } = data)
</script>

<section class="gradient">
  <Hero2 />
</section>

{#if page.sektioner?.references?.nodes}
  {#each page.sektioner.references.nodes as section, index}
    <SektionBokgalleri {section} class={index % 2 === 0 ? 'bg-surface-50-900-token' : 'bg-surface-100-800-token'} />
  {/each}
{/if}
