<script lang="ts">
  import { fragment, graphql, type SectionNewsFragment } from '$houdini'
  import { onlyMediaImage } from '$lib'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import Section from './Section.svelte'
  import ShopifyImage from './shopify/ShopifyImage.svelte'

  let className = ''
  export { className as class }
  export let section: SectionNewsFragment

  $: data = fragment(
    section,
    graphql(`
      fragment SectionNewsFragment on Metaobject {
        id
        title: field(key: "title") {
          value
        }
        text: field(key: "text") {
          value
        }
        image: field(key: "image") {
          reference {
            ... on MediaImage {
              image {
                altText
                url
                width
                height
              }
            }
          }
        }
      }
    `),
  )
  $: html = $data?.text?.value ? convertSchemaToHtml(JSON.parse($data.text.value)) : undefined
</script>

<Section title={$data?.title?.value ?? ''} level={2} class={className}>
  <div class="flex justify-stretch gap-10">
    <div>
      <p>{@html html}</p>
    </div>
    {#if $data?.image?.reference}
      <ShopifyImage image={onlyMediaImage($data.image.reference)?.image} width={200} />
    {/if}
  </div>
</Section>
