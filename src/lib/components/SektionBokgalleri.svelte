<script lang="ts">
  import { fragment, graphql, type SektionBokgalleri } from '$houdini'
  import Section from './Section.svelte'
  import BookCardPromo from './BookCardPromo.svelte'

  let className = ''
  export { className as class }
  export let section: SektionBokgalleri

  $: data = fragment(
    section,
    graphql(`
      fragment SektionBokgalleri on Metaobject {
        id
        handle
        rubrik: field(key: "rubrik") {
          value
        }
        visa: field(key: "visa_antal") {
          value
        }
        bocker: field(key: "bocker") {
          references(first: 10) {
            nodes {
              ...BookPromo
            }
          }
        }
      }
    `),
  )
</script>

<Section title={$data.rubrik?.value || 'Boktips'} class={className}>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    {#each $data.bocker?.references?.nodes ?? [] as book}
      <BookCardPromo {book} />
    {/each}
  </div>
</Section>
