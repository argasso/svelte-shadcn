<script lang="ts">
  import Icons from './shopify/Icons.svelte'
  import type { Products$result } from '$houdini'
  import { authorUrl, bookUrl, onlyMetaobjects } from '$lib'
  import ShopifyImage from './shopify/ShopifyImage.svelte'
  import { addToCart, addToCartLoading } from '$lib/shopify'
  import Button from './ui/button/button.svelte'

  type BookThumb = NonNullable<Products$result['collection']>['products']['nodes'][number]
  export let bookThumb: BookThumb
  export let width: number = 160
  export let loading = false

  $: ({ title, handle, variants } = bookThumb)
  $: href = bookUrl(handle)
  $: image = bookThumb.images.nodes?.[0]
  $: authors = onlyMetaobjects(bookThumb.authors?.references?.nodes)
    .filter((n) => n.title?.value)
    .map(({ handle, title }) => ({
      href: authorUrl(handle),
      name: title?.value ?? '',
    }))
  $: discontinued = variants.nodes[0].discontinued?.value === 'true'
  $: ({ id: variantId, price } = variants.nodes[0])
  async function addProduct() {
    await addToCart(variantId, { title, price, image })
  }
</script>

<div class:loading class="mt-auto w-48 opacity-100">
  <div class="grid w-40 drop-shadow-xl">
    <a class="col-start-1 row-start-1 hover:no-underline" {href}>
      <ShopifyImage class="rounded bg-gray-100" {image} {width} />
    </a>
    {#if discontinued}
      <div
        class="ribbon col-start-1 row-start-1 -mb-2 -mr-1 self-end justify-self-end text-xs text-primary-foreground"
      >
        Boken har utgått
      </div>
    {:else}
      <Button
        on:click={addProduct}
        variant="buy"
        size="icon"
        class="group z-auto col-start-1 row-start-1 -mb-3 -mr-4 flex items-center self-end justify-self-end hover:w-auto hover:bg-primary focus:w-auto focus:bg-primary"
      >
        <div class="hidden flex-1 whitespace-nowrap px-2 group-hover:block group-focus:block">
          Lägg i varukorg
        </div>
        {#if $addToCartLoading === variantId}
          <Icons class="flex-0 h-5 w-5" type="loading" />
        {:else}
          <Icons class="flex-0 h-5 w-5" type="cart-add" />
        {/if}
      </Button>
    {/if}
  </div>
  <div class="h-28 pt-2">
    <a {href}>
      <h3 class="my-1 font-sans text-base font-semibold">{title}</h3>
    </a>
    <div class="leading-4x">
      {#each authors as author, index}
        <a class="text-xs" href={author.href}>
          {author.name}
        </a>
        {#if index < authors.length - 1}
          &middot;&nbsp;
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .loading {
    @apply opacity-50 transition-opacity;
  }

  .ribbon {
    --ribbon-radius: 0.5em; /* control the ribbon shape (the radius) */
    --ribbon-color: hsl(var(--primary));
    /* color: hsl(var(--primary-foreground)); */
  }
</style>
