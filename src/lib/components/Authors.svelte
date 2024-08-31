<script lang="ts">
  import { fragment, graphql, type AuthorsFragment } from '$houdini'
  import { authorUrl, onlyMetaobjects } from '$lib'
  import Link from './Link.svelte'

  export let book: AuthorsFragment
  export let one = false

  $: data = fragment(
    book,
    graphql(`
      fragment AuthorsFragment on Product {
        authors: metafield(namespace: "custom", key: "authors") {
          references(first: 3) {
            nodes {
              ... on Metaobject {
                id
                handle
                name: field(key: "name") {
                  value
                }
              }
            }
          }
        }
      }
    `),
  )
  $: authors = onlyMetaobjects($data.authors?.references?.nodes)
  $: numAuthors = authors?.length ?? 0
</script>

{#if numAuthors > 0}
  {#each authors as author, index}
    {#if !one || index === 0}
      {#if index > 0}
        &nbsp;&middot;
      {/if}
      <Link class="font-sans text-xs uppercase" href={authorUrl(author.handle)}>
        {author.name?.value}
      </Link>
    {/if}
  {/each}
  {#if one && authors.length > 1}
    m.fl.
  {/if}
{/if}
