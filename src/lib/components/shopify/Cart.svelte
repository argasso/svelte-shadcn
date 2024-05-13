<script lang="ts">
  import Minus from 'svelte-radix/Minus.svelte'
  import Plus from 'svelte-radix/Plus.svelte'
  import Sun from 'svelte-radix/Sun.svelte'
  import Trash from 'svelte-radix/Trash.svelte'
  import Cross from 'svelte-radix/Cross1.svelte'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
  import Icons from './Icons.svelte'
  import type { Cart$result } from '$houdini'
  import { formatPrice, parseJSON } from '$lib'
  import { addToCart, cartStore, isCartLoading, updateCart } from '$lib/shopify'
  import { ScrollArea } from '$lib/components/ui/scroll-area'
  import { Separator } from '$lib/components/ui/separator'
  import Card from '../ui/card/card.svelte'
  import ShopifyImage from './ShopifyImage.svelte'
  type Item = NonNullable<Cart$result['cart']>['lines']['edges'][number]

  $: items = $cartStore.data?.cart?.lines.edges ?? []
  $: quantity = items.reduce((sum, item) => sum + item.node.quantity, 0)
  $: subtotal = items
    .map((item) => item.node.cost.totalAmount)
    .reduce(
      (total, item) => {
        return {
          amount: String(parseFloat(total.amount) + parseFloat(item.amount)),
          currencyCode: total.currencyCode,
        }
      },
      { amount: '0', currencyCode: 'SEK' },
    )
  $: currency = items.at(0)?.node.cost.totalAmount.currencyCode

  function addOneItem(item: Item) {
    addToCart(item.node.merchandise.id)
  }

  function removeOneItem(item: Item) {
    let quantity = item.node.quantity - 1
    updateCart({
      variantId: item.node.merchandise.id,
      lineId: item.node.id,
      quantity,
    })
  }

  function removeEntireItem(item: Item) {
    updateCart({
      variantId: item.node.merchandise.id,
      lineId: item.node.id,
      quantity: 0,
    })
  }
  async function checkout() {
    let checkoutUrl = localStorage.getItem('cartUrl')
    window.open(parseJSON(checkoutUrl), '_blank')
  }
</script>

<Drawer.Root shouldScaleBackground={false} direction="right">
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon" class="relative flex-none">
      {#if quantity > 0}
        <div
          class="absolute -right-1 -top-1 min-w-5 rounded-full border-2 border-primary bg-white px-1 text-xs text-primary"
        >
          {quantity}
        </div>
        <Icons type="cart-heart" />
      {:else}
        <Icons type="cart" />
      {/if}
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="right" class="flex justify-center">
    <!-- {#if $isCartLoading}
      <div class="absolute inset-0 z-50 bg-black/20" />
    {/if} -->
    <div class="mx-auto flex h-full max-w-md flex-col gap-4">
      {#if items.length === 0}
        <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-500"
          >
            <Icons type="cart" />
          </div>
          <h3 class="mt-6 text-center text-2xl">Varukorgen är tom.</h3>
        </div>
      {:else}
        <h2 class="mt-8 text-center text-2xl">{quantity} böcker i varukorgen</h2>
        <ScrollArea class="min-h-0 flex-1 rounded-md border p-3">
          {#each items as item, i (i)}
            {#if i > 0}
              <Separator class="my-3" />
            {/if}
            <div class="flex w-full gap-3">
              <ShopifyImage
                class="rounded-sm"
                width={64}
                image={item.node.merchandise.product.images.edges[0].node}
              />
              <div class="flex flex-1 flex-col justify-between">
                <div class="flex-1">
                  <h3 class="font-sans text-lg font-bold">
                    {item.node.merchandise.product.title}
                  </h3>
                  {#if item.node.merchandise.title !== 'Default Title'}
                    <p class="text-sm">{item.node.merchandise.title}</p>
                  {/if}
                </div>
                <div class="flex-0 flex items-center gap-2">
                  <div class="flex items-stretch">
                    <Button
                      size="icon"
                      variant="outline"
                      on:click={() => {
                        removeOneItem(item)
                      }}
                      class="h-8 w-8 rounded-r-none shadow-none"
                    >
                      <Minus />
                    </Button>
                    <div class="flex min-w-14 items-center border-y px-3 text-sm">
                      {item.node.quantity} st
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      on:click={() => {
                        addOneItem(item)
                      }}
                      class="h-8 w-8 rounded-l-none shadow-none"
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    on:click={() => {
                      removeEntireItem(item)
                    }}
                    class="h-8 w-8"
                  >
                    <Trash />
                  </Button>
                  <div class="ml-auto">
                    <h3 class="m-0">{formatPrice(item.node.cost.totalAmount)}</h3>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </ScrollArea>
        <Drawer.Footer class="text-right">
          <h3>Delsumma {formatPrice(subtotal)}</h3>
        </Drawer.Footer>
        <Drawer.Footer>
          <Button on:click={checkout} size="lg">
            <span> Till betalning </span>
            {#if $isCartLoading}
              <Icons type="loading" class="ml-3" />
            {:else}
              <Icons type="cart-checkout" class="ml-3" />
            {/if}
          </Button>
          <Drawer.Close asChild let:builder>
            <Button builders={[builder]} variant="outline" size="lg">Fortsätt shoppa</Button>
          </Drawer.Close>
        </Drawer.Footer>
      {/if}
    </div>
  </Drawer.Content>
</Drawer.Root>
