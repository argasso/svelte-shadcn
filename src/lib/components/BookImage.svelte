<script lang="ts">
  import ShopifyImage, { type ImageProp } from './shopify/ShopifyImage.svelte'

  export let width: number
  export let image: ImageProp
  export let href: string | undefined = undefined
</script>

<div class="book grid">
  <ShopifyImage class="col-start-1 row-start-1 bg-gray-100" {image} {width} />
  <div class="book-overlay col-start-1 row-start-1 h-full" style="width: {width}px"></div>
  {#if href}
    <a {href} class="col-start-1 row-start-1" aria-label="Visa bok"></a>
  {/if}
</div>
