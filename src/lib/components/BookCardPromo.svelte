<script lang="ts">
  import { fragment, graphql, type BookPromo } from '$houdini'
  import { bookUrl, isNonNil, onlyMetaobjects } from '$lib'
  import { flatten, type MenuItem } from '$lib/menu'
  import Authors from './Authors.svelte'
  import BookImage from './BookImage.svelte'
  import Pill from './Pill.svelte'

  export let book: BookPromo
  export let menu: MenuItem | undefined

  $: data = fragment(
    book,
    graphql(`
      fragment BookPromo on Product {
        id
        title
        handle
        descriptionHtml
        images(first: 1) {
          nodes {
            url
            altText
            height
            width
          }
        }
        ...AuthorsFragment
        variants(first: 1) {
          nodes {
            price {
              ...PriceFragment
            }
            categories: metafield(namespace: "book", key: "category") {
              references(first: 5) {
                nodes {
                  ... on Metaobject {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `),
  )
  $: variant = $data?.variants.nodes?.[0]
  $: menuItems = flatten(menu)
  $: categories = onlyMetaobjects(variant.categories?.references?.nodes)
    .map((c) => menuItems.find((i) => i.id === c.id))
    .filter((c) => c?.parent?.href !== '/')
    .filter(isNonNil)
</script>

<div class="flex flex-row items-start gap-6">
  <BookImage href={bookUrl($data.handle)} image={$data.images.nodes[0]} width={128} />
  <div class="flex-0 flex flex-col items-start justify-center">
    <p class="my-0 font-serif text-xs">
      <Authors book={$data}></Authors>
    </p>

    <h3 class="my-0 text-lg font-semibold leading-6">
      <a class="text-foreground" href={bookUrl($data.handle)}>{$data.title}</a>
    </h3>

    <p class="my-3 line-clamp-5 text-sm leading-normal text-muted-foreground">
      {@html $data.descriptionHtml}
    </p>
    <!-- {#if $data?.variants?.nodes?.[0]}
      <Price price={variant?.price} />
    {/if} -->
    {#if categories}
      <p>
        {#each categories as category (category.href)}
          <Pill name={category.name} href={category.href} />
        {/each}
      </p>
    {/if}
    <!-- <p class="text-xs uppercase text-gray-500">{generalDetails.publishMonth}</p> -->
  </div>
</div>
