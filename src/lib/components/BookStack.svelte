<script lang="ts">
  import { fragment, graphql, type BookStackFragment } from '$houdini'
  import { onlyProducts } from '$lib'
  import ShopifyImage from './shopify/ShopifyImage.svelte'

  export let books: BookStackFragment

  $: data = fragment(
    books,
    graphql(`
      fragment BookStackFragment on Metaobject {
        books: field(key: "books") {
          references(first: 10) {
            nodes {
              ... on Product {
                title
                images(first: 1) {
                  nodes {
                    url
                    altText
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    `),
  )
  $: products = onlyProducts($data.books?.references?.nodes)
  $: left = 75 / (products.length ?? 1)
  $: top = 150 / (products.length ?? 1)
</script>

{#if products}
  <div class="flex-0 grid">
    {#each products as book, i}
      <div
        class="col-start-1 row-start-1"
        style="margin-left: {i * left}px; margin-top: {i * top}px"
      >
        <ShopifyImage class="shadow" image={book.images.nodes[0]} width={80} />
      </div>
    {/each}
  </div>
{/if}
