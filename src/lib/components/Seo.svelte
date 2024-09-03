<script lang="ts">
  import { fragment, graphql, type SeoFragment } from '$houdini'
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText'
  import { MetaTags } from 'svelte-meta-tags'

  export let page: SeoFragment
  export let pageTitle: string | null | undefined = undefined
  export let pageContent: string | null | undefined = undefined

  $: data = fragment(
    page,
    graphql(`
      fragment SeoFragment on Metaobject {
        seo {
          title {
            value
          }
          description {
            value
          }
        }
      }
    `),
  )
  $: title = $data.seo?.title?.value ?? pageTitle ?? 'No title yet'
  $: description = $data.seo?.description?.value ?? convertSchemaToText(pageContent) ?? undefined
  $: console.log('in SEO', title)
</script>

<MetaTags {title} titleTemplate="%s | Argasso bokförlag" {description} />
