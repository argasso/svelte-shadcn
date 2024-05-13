<script lang="ts">
  import Icons from './shopify/Icons.svelte'
  import { type Products$result, type LoadingType, PendingValue } from '$houdini'
  import { authorUrl, bookUrl, onlyMetaobjects } from '$lib'
  import ShopifyImage from './shopify/ShopifyImage.svelte'
  import { addToCart, addToCartLoading } from '$lib/shopify'
  import Button from './ui/button/button.svelte'
  import Skeleton from './ui/skeleton/skeleton.svelte'
  import BookDetails from './BookDetails.svelte'

  type BookThumb = NonNullable<Products$result['collection']>['products']['nodes'][number]
  export let bookThumb: BookThumb
  export let width: number = 160

  // $: ({ title, handle, variants } = bookThumb)
  // $: href = bookUrl(handle)
  // $: image = bookThumb.images.nodes?.[0]
  // $: authors = onlyMetaobjects(bookThumb.authors?.references?.nodes)
  //   .filter((n) => n.title?.value)
  //   .map(({ handle, title }) => ({
  //     href: authorUrl(handle),
  //     name: title?.value ?? '',
  //   }))
  // $: discontinued = variants.nodes[0].discontinued?.value === 'true'
  // $: ({ id: variantId, price } = variants.nodes[0])

  function getAuthors(bookThumb: Exclude<BookThumb, typeof PendingValue>) {
    return onlyMetaobjects(bookThumb.authors?.references?.nodes)
      .filter((n) => n.title?.value)
      .map(({ handle, title }) => ({
        href: authorUrl(handle),
        name: title?.value ?? '',
      }))
  }

  async function addProduct() {
    if (bookThumb !== PendingValue) {
      const { title, images, variants } = bookThumb
      const { id: variantId, price } = variants.nodes[0]
      const image = images.nodes?.[0]
      await addToCart(variantId, { title, price, image })
    }
  }
</script>

<div style="widthx: {width}px" class="mt-auto w-48">
  <div class="grid w-40">
    {#if bookThumb === PendingValue}
      <Skeleton class="h-[305px] w-[160px] rounded-sm bg-muted" />
    {:else}
      <a class="col-start-1 row-start-1 hover:no-underline" href={bookUrl(bookThumb.handle)}>
        <ShopifyImage class="rounded bg-gray-100" image={bookThumb.images.nodes?.[0]} {width} />
      </a>
      {#if bookThumb.variants.nodes[0].discontinued?.value === 'true'}
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
          {#if $addToCartLoading === bookThumb.variants.nodes[0].id}
            <Icons class="flex-0 h-5 w-5" type="loading" />
          {:else}
            <Icons class="flex-0 h-5 w-5" type="cart-add" />
          {/if}
        </Button>
      {/if}
    {/if}
  </div>
  <div class="h-28 pt-2">
    {#if bookThumb === PendingValue}
      <Skeleton class="h-[14px] w-[140px] rounded-sm bg-muted" />
    {:else}
      <a href={bookUrl(bookThumb.handle)}>
        <h3 class="my-1 font-sans text-base font-semibold">{bookThumb.title}</h3>
      </a>
    {/if}
    <div class="leading-4">
      {#if bookThumb === PendingValue}
        <Skeleton class="h-[12px] w-[100px] rounded-sm bg-muted" />
      {:else}
        {#each getAuthors(bookThumb) as author, index}
          {#if index > 0}
            &middot;&nbsp;
          {/if}
          <a class="text-xs" href={author.href}>
            {author.name}
          </a>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .ribbon {
    --ribbon-radius: 0.5em; /* control the ribbon shape (the radius) */
    --ribbon-color: hsl(var(--primary));
    /* color: hsl(var(--primary-foreground)); */
  }
</style>
