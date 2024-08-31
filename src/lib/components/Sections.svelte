<script lang="ts">
  import { fragment, graphql, type SectionsFragment } from '$houdini'
  import { onlyMetaobjects } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import SectionNews from './SectionNews.svelte'
  import SektionBokgalleri from './SektionBokgalleri.svelte'

  export let sections: SectionsFragment
  export let menu: MenuItem | undefined

  $: data = fragment(
    sections,
    graphql(`
      fragment SectionsFragment on Metaobject {
        sections: field(key: "sektioner") {
          references(first: 10) {
            nodes {
              ... on Metaobject {
                type
              }
              ...SektionBokgalleri
              ...SectionNewsFragment
            }
          }
        }
      }
    `),
  )
</script>

{#if $data?.sections?.references?.nodes}
  {#each onlyMetaobjects($data.sections?.references?.nodes) as section, index}
    {#if section.type === 'sektion_slides'}
      {section.type}
    {/if}
    {#if section.type === 'sektion_bokgalleri'}
      <SektionBokgalleri {section} {menu} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
    {/if}
    {#if section.type === 'section_news'}
      <SectionNews {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
    {/if}
  {/each}
{/if}
