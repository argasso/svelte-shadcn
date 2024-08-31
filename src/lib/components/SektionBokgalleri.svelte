<script lang="ts">
  import { fragment, graphql, type SektionBokgalleri } from '$houdini'
  import type { MenuItem } from '$lib/menu'
  import BookCardPromo from './BookCardPromo.svelte'
  import Section from './Section.svelte'
  import Separator from './ui/separator/separator.svelte'

  let className = ''
  export { className as class }
  export let section: SektionBokgalleri
  export let menu: MenuItem | undefined

  $: data = fragment(
    section,
    graphql(`
      fragment SektionBokgalleri on Metaobject {
        id
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

<Section title={$data.rubrik?.value || ''} level={2} class={className}>
  <div class="flex flex-col justify-stretch md:flex-row">
    {#each $data.bocker?.references?.nodes ?? [] as book, index}
      {#if index > 0}
        <div class="hidden self-stretch px-8 md:flex">
          <Separator orientation="vertical" />
        </div>
      {/if}
      <div class="mb-5 flex-1 md:mb-0">
        <BookCardPromo {book} {menu} />
      </div>
    {/each}
  </div>
  <!-- <Carousel.Root
    opts={{
      align: 'start',
    }}
    class="w-full"
  >
    <Carousel.Content>
      {#each $data.bocker?.references?.nodes ?? [] as book}
        <Carousel.Item class="md:basis-1/2 lg:basis-1/3">
          <div class="p-1">
            <Card.Root>
              <Card.Content class="flex aspect-square items-center justify-center p-6">
                <BookCardPromo {book} />
              </Card.Content>
            </Card.Root>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root> -->
</Section>
