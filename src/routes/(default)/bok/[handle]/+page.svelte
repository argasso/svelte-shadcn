<script lang="ts">
  import BookDetails from '$lib/components/BookDetails.svelte'
  import Breadcrumb from '$lib/components/Breadcrumbs.svelte'
  import { notEmpty, onlyMetaobjects, parseJSON, publishMonth, formatPrice } from '$lib'
  import type { PageData } from './$houdini'
  import GridTile from '$lib/components/GridTile.svelte'
  import Icons from '$lib/components/shopify/Icons.svelte'
  import ShopifyImage from '$lib/components/shopify/ShopifyImage.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { addToCart, isCartLoading } from '$lib/shopify'
  import Button from '$lib/components/ui/button/button.svelte'

  export let data: PageData

  $: ({ Product, metafieldLabels } = data)
  $: product = $Product.data?.product
  $: authors = onlyMetaobjects(product?.authors?.references?.nodes)
  $: variants =
    product?.variants.nodes.map((variant) => {
      const isbn = variant.barcode
        ? { label: 'ISBN', key: 'isbn', value: variant.barcode }
        : undefined
      const variantMetafields = variant.metafields.map((metafield) => {
        if (metafield) {
          const { key, type, references } = metafield
          const label = metafieldLabels.get(key) ?? key
          let value = metafield.value

          if (type === 'list.metaobject_reference') {
            value = onlyMetaobjects(references?.nodes)
              .map((m) => m.title?.value)
              .filter(notEmpty)
              .join(', ')
          } else if (type === 'list.single_line_text_field') {
            const parsed = JSON.parse(value)
            value = Array.isArray(parsed) ? parsed.join(', ') : parsed
          } else if (type === 'date' && key === 'publish_month') {
            value = publishMonth(value)
          }
          return value ? { label, key, value } : undefined
        }
      })
      const metafields = [isbn, ...variantMetafields].filter(notEmpty)

      return {
        ...variant,
        metafields,
      }
    }) ?? []
  $: selectedVariant = variants?.[0]
  $: ({ image, price, id } = selectedVariant)

  // SHOPIFY

  let currentImageIndex = 0

  async function addProduct() {
    await addToCart(id, { image, title: product?.title, price })
  }
</script>

<svelte:head>
  <title>{product?.title}</title>
</svelte:head>

<div class="container">
  <Breadcrumb crumbs={[]} />
  {#if product && selectedVariant}
    <section class="overflow-hidden py-4">
      <div
        class="grid-row-gap grid grid-cols-[1fr_2fr] grid-rows-[auto_1fr_auto_auto] gap-6 sm:grid-rows-[auto_auto_auto_1fr]"
      >
        <div class="row-span-2 sm:row-span-4">
          <ShopifyImage
            image={selectedVariant.image}
            alt={`Omslag för ${product?.title} - ${selectedVariant.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(', ')}`}
          />
        </div>
        <div class="">
          <div class="flex items-center justify-between">
            <h2
              class="title-font my-1 text-xs uppercase tracking-widest sm:text-sm md:text-base lg:text-lg"
            >
              {#each authors as author}
                <a class="author" href={`/information/forfattare/${author.handle}`}
                  >{author.title?.value}</a
                >
              {/each}
            </h2>
            <!-- <div class="ml-2 flex gap-2 border-l-2 border-gray-200 py-2 pl-2 text-lg sm:text-2xl">
              <a href="" class="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                  ><path
                    fill="currentColor"
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                  /></svg
                >
              </a>
              <a href="">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                  ><path
                    fill="currentColor"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                  /></svg
                >
              </a>
            </div> -->
          </div>
          <h1 class="my-0 text-2xl font-medium lg:text-3xl xl:text-4xl">
            {product?.title}

            <span class="text-xs font-light uppercase sm:text-sm lg:text-lg">
              - {selectedVariant.metafields.find((m) => m.key === 'binding')?.value}
            </span>
          </h1>
        </div>
        <div class="col-span-2 col-start-1 row-start-3 sm:col-span-1 sm:col-start-2 sm:row-start-2">
          {@html product?.descriptionHtml}
        </div>
        <div class="col-start-2 row-start-2 sm:col-start-2 sm:row-start-3">
          {#if selectedVariant.discontinued?.value === 'true'}
            <div
              class="border-argasso2-500 bg-argasso-50 text-argasso2-700 rounded-r-lg border-l-4 p-4"
              role="alert"
            >
              <p class="font-bold">Utgått</p>
              <p>Denna titel har utgått och går inte längre att köpa.</p>
            </div>
            <!-- <a
                href={`https://www.bokfynd.nu/${selectedVariant.barcode}`}
                target="_blank"
                class="focus:shadow-outline ml-auto flex rounded-full bg-slate-200 px-12 py-4 shadow-lg"
              >
                Köp via Bokfynd
              </a> -->
          {:else}
            <div class="flex flex-col items-center justify-end gap-4 sm:flex-row">
              <span class="text-argasso2-200 text-xl font-semibold"
                >{formatPrice(selectedVariant.price)}</span
              >
              <Button size="lg" on:click={addProduct}>
                <span>Lägg i varukorg</span>
                <div class="mr-2 flex h-6 w-6 items-center text-xl">
                  {#if $isCartLoading}
                    <Icons type="loading" />
                  {:else}
                    <Icons type="cart-add" />
                  {/if}
                </div>
              </Button>
            </div>
          {/if}
        </div>
        <div class="col-span-2 row-start-4 sm:col-span-1 sm:col-start-2 sm:row-start-4">
          <BookDetails details={selectedVariant.metafields} />
          {#if variants.length > 1}
            <h4>Finns i flera format</h4>
            <div class="my-2 flex gap-2">
              {#each variants as variant, i}
                <button
                  class="flex items-center gap-3 rounded border-2 border-solid bg-gray-50 p-2 text-sm shadow-sm {selectedVariant.id ===
                  variant.id
                    ? 'border-argasso2-200'
                    : ''}"
                  disabled={selectedVariant.id === variant.id}
                  on:click={() => (selectedVariant = variant)}
                >
                  <div class="flex-none">
                    <ShopifyImage
                      image={variant.image}
                      height={40}
                      on:click={() => {
                        currentImageIndex = i
                      }}
                    />
                  </div>
                  <div class="flex-grow">
                    {variant.selectedOptions.map((o) => o.value).join(' - ')}
                  </div>
                  <div class="flex-none">
                    {formatPrice(variant.price)}
                  </div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <!-- <div class="mx-auto my-10 flex flex-wrap">
        <div class="w-1/3 sm:w-1/3">
          {#if selectedVariant.image}
            <ShopifyImage
              image={selectedVariant.image}
              alt={`Omslag för ${product?.title} - ${selectedVariant.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(', ')}`}
            />
          {:else}
            <PlaceholderBook />
          {/if}
        </div>
        <div class="w-2/3 pl-5 sm:pl-10">
          <div class="flex items-center justify-between">
            <h2 class="title-font my-1 text-sm uppercase tracking-widest text-gray-900 lg:text-xl">
              {#each authors as author}
                <a class="author" href={author.handle}>{author.title?.value}</a>
              {/each}
            </h2>
            <div class="ml-3 flex border-l-2 border-gray-200 py-2 pl-3">
              <a class="text-gray-500">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <h1 class="my-3 text-2xl font-medium text-gray-900 lg:text-3xl xl:text-4xl">
            {product?.title}

            <span class="text-sm font-light uppercase text-gray-500 lg:text-lg">
              - {selectedVariant.metafields.find((m) => m.key === 'binding')?.value}
            </span>
          </h1>

          <div class="hidden sm:block">
            {@html product?.descriptionHtml}
            <div class="mx-1 my-5 flex items-center justify-end gap-4">
              <span class="text-xl font-semibold text-argasso2-200"
                >{formatPrice(selectedVariant.price)}</span
              >
              <button
                on:click={addToCart}
                class="focus:shadow-outline flex items-center justify-center rounded-full bg-argasso2-300 px-8 py-3 text-white shadow-lg hover:bg-argasso2-200 active:bg-argasso2-400"
              >
                <div class="mr-2 flex h-6 w-6 items-center">
                  {#if cartLoading}
                    <Icon icon="eos-icons:three-dots-loading" class="mx-auto text-3xl" />
                  {:else}
                    <Icon icon="mdi:cart-plus" class="mx-auto" />
                  {/if}
                </div>
                <span>Lägg i varukorgen</span>
              </button>
            </div>
          </div>

          <div class="hidden lg:block">
            <BookDetails details={selectedVariant.metafields} />
          </div>
          {#if variants.length > 1}
            <h4>Finns i flera format</h4>
            <div class="my-2 flex gap-2">
              {#each variants as variant, i}
                <button
                  class="flex items-center gap-3 rounded border border-solid bg-gray-50 p-2 text-sm {selectedVariant.id ===
                  variant.id
                    ? 'border-argasso2-500'
                    : ''}"
                  disabled={selectedVariant.id === variant.id}
                  on:click={() => (selectedVariant = variant)}
                >
                  <div class="flex-none">
                    <ShopifyImage
                      layout="constrained"
                      height={40}
                      on:click={() => {
                        currentImageIndex = i
                      }}
                      image={variant.image}
                      alt={`Omslag för ${product?.title} - ${variant.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(', ')}`}
                    />
                  </div>
                  <div class="flex-grow">
                    {variant.selectedOptions.map((o) => o.value).join(' - ')}
                  </div>
                  <div class="flex-none">
                    {variant.price.amount}
                    {variant.price.currencyCode}
                  </div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <div class="sm:hidden">
        {@html product?.descriptionHtml}
        <div class="mx-1 my-5 flex">
          <a
            href={`https://www.bokfynd.nu/${product?.variants.nodes[0].barcode}`}
            target="_blank"
            class="focus:shadow-outline ml-auto flex rounded-full bg-argasso-600 px-12 py-4 text-white shadow-lg hover:bg-argasso-500 active:bg-argasso-700"
          >
            Köp via Bokfynd
          </a>
          <button
            on:click={addToCart}
            class=" mt-6 flex items-center justify-center p-4 text-sm uppercase tracking-wide text-black hover:opacity-100"
          >
            <span>Add To Cart</span>
            {#if cartLoading}
              <Spinner class="mr-1" />
            {/if}
          </button>
        </div>
      </div>
      <div class="lg:hidden">
        <BookDetails details={selectedVariant.metafields} />
      </div> -->
    </section>
  {/if}
</div>

<style>
  .author ~ .author::before {
    content: ', ';
  }
</style>
