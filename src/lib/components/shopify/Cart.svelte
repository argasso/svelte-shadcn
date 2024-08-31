<script lang="ts">
  import type { Cart$result } from '$houdini'
  import { parseJSON } from '$lib'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
  import { ScrollArea } from '$lib/components/ui/scroll-area'
  import { addToCart, cartOpen, cartStore, isCartLoading, updateCart } from '$lib/shopify'
  import Minus from 'svelte-radix/Minus.svelte'
  import Plus from 'svelte-radix/Plus.svelte'
  import Trash from 'svelte-radix/Trash.svelte'
  import BookImage from '../BookImage.svelte'
  import Price from '../Price.svelte'
  import Icons from './Icons.svelte'

  type Item = NonNullable<Cart$result['cart']>['lines']['edges'][number]

  $: cart = $cartStore.data?.cart
  $: items = cart?.lines.edges ?? []
  $: quantity = cart?.totalQuantity ?? 0

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

<Drawer.Root shouldScaleBackground={false} direction="right" bind:open={$cartOpen}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon" class="relative flex-none">
      {#if quantity > 0}
        <div
          class="absolute -right-1 -top-1 min-w-5 rounded-full border-2 border-[#9e003e] bg-white px-1 text-xs text-primary"
        >
          {quantity}
        </div>
        <Icons type="cart-heart" />
      {:else}
        <Icons type="cart" />
      {/if}
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="right">
    <div class="flex h-full flex-col">
      {#if cart && items.length > 0}
        <Drawer.Header class="flex-0 h-14 flex-shrink-0 items-center border-b p-0 sm:text-center">
          <h2 class="m-0 text-lg font-semibold">{quantity} böcker i varukorgen</h2>
        </Drawer.Header>
        <!-- <div class="flex flex-1 flex-col p-6"> -->
        <ScrollArea class="flex-0 min-h-0 border-b">
          <div class="p-8 py-3">
            {#each items as item, i (i)}
              {#if i > 0}
                <!-- <Separator class="my-3" /> -->
              {/if}
              <div class="flex w-full gap-4 py-3">
                <div class="self-start">
                  <BookImage
                    width={64}
                    image={item.node.merchandise.product.images.edges[0]?.node}
                  />
                </div>
                <div class="flex flex-1 flex-col justify-between py-2">
                  <div class="flex-1">
                    <h3 class="m-0 text-base font-semibold">
                      {item.node.merchandise.product.title}
                    </h3>
                    {#if item.node.merchandise.title !== 'Default Title'}
                      <p class="m-0 text-sm">{item.node.merchandise.title}</p>
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
                      <div class="flex min-w-14 items-center border-y border-input px-3 text-sm">
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
                      <Price class="m-0" price={item.node.cost.totalAmount}></Price>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </ScrollArea>
        <div class="my-4 flex flex-row justify-between px-8 text-right">
          <h2 class="m-0 text-base">Delsumma inkl. moms</h2>
          <Price price={cart?.cost.totalAmount} />
        </div>
        <p class="mx-8 text-xs italic">
          Fraktkostnad beräknas i nästa steg. Alltid gratis frakt över 600 kr.
        </p>
        <!-- </div> -->
        <Drawer.Footer class="flex grow p-10 py-6">
          <Drawer.Close asChild let:builder>
            <Button class="" builders={[builder]} variant="outline" size="lg"
              >Fortsätt handla</Button
            >
          </Drawer.Close>
          <Button class="" on:click={checkout} target="_self" size="lg">
            <span> Till betalning </span>
            {#if $isCartLoading}
              <Icons type="loading" class="ml-3" />
            {:else}
              <Icons type="cart-checkout" class="ml-3" />
            {/if}
          </Button>
        </Drawer.Footer>
      {:else}
        <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-500"
          >
            <Icons type="cart" />
          </div>
          <h3 class="mt-6 text-center text-2xl">Varukorgen är tom.</h3>
        </div>
      {/if}
    </div>
  </Drawer.Content>
</Drawer.Root>
