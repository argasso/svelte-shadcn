<script lang="ts">
	import Minus from 'svelte-radix/Minus.svelte';
	import Plus from 'svelte-radix/Plus.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Icons from './Icons.svelte';
	import type { Cart$result } from '$houdini';
	import { formatPrice, parseJSON } from '$lib';
	import { addToCart, cartStore, isCartLoading, updateCart } from '$lib/shopify';

	type Item = NonNullable<Cart$result['cart']>['lines']['edges'][number];

	$: items = $cartStore.data?.cart?.lines.edges ?? [];
	$: quantity = items.reduce((sum, item) => sum + item.node.quantity, 0) ?? 0;

	function addOneItem(item: Item) {
		addToCart(item.node.merchandise.id);
	}

	function removeOneItem(item: Item) {
		let quantity = item.node.quantity - 1;
		updateCart({
			variantId: item.node.merchandise.id,
			lineId: item.node.id,
			quantity
		});
	}

	function removeEntireItem(item: Item) {
		updateCart({
			variantId: item.node.merchandise.id,
			lineId: item.node.id,
			quantity: 0
		});
	}
	async function checkout() {
		let checkoutUrl = localStorage.getItem('cartUrl');
		window.open(parseJSON(checkoutUrl), '_blank');
	}
</script>

<Drawer.Root shouldScaleBackground={false} direction={'right'}>
	<Drawer.Trigger asChild let:builder>
		<Button builders={[builder]} variant="header" size="icon" class="relative">
			{#if quantity > 0}
				<div
					class="absolute -right-1 -top-1 min-w-4 rounded-full border-2 border-primary bg-white px-1 text-xs text-primary"
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
		<div class="mx-auto max-w-sm">
			<Drawer.Header>
				<Drawer.Title>Varukorg</Drawer.Title>
				<Drawer.Description>Följande bocker finns i din varukorg</Drawer.Description>
			</Drawer.Header>
			<div class="relative z-10 w-full">
				{#if $isCartLoading}
					<div class="absolute inset-0 z-50 bg-black/20" />
				{/if}
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
					<div class="flex w-full items-center justify-between">
						<h2 class="text-2xl">Varukorg</h2>
					</div>
				{/if}
				<div class="overflow-y-auto" style="height: 80%;">
					{#each items as item, i (i)}
						<div class="flex w-full border-t border-black/20 py-3">
							<img
								alt={item.node.merchandise.product.title}
								decoding="async"
								loading="lazy"
								class="w-16 flex-none bg-white"
								src={item.node.merchandise.product.images.edges[0].node.url}
							/>
							<div class="ml-4 flex w-full flex-col justify-between">
								<div class="flex w-full justify-between">
									<div class="w-full">
										<p class="text-lg font-medium">{item.node.merchandise.product.title}</p>
										<p class="text-sm">{item.node.merchandise.title}</p>
										<div class="flex w-full items-center">
											<button
												on:click={() => {
													removeEntireItem(item);
												}}
												class="mr-2 flex h-8 w-8 items-center justify-center rounded border border-black/20 bg-gray-50 hover:bg-gray-100"
											>
												<Icons type="close" strokeColor="#333" />
											</button>
											<div class="flex h-8 items-stretch rounded border border-black/20">
												<button
													on:click={() => {
														removeOneItem(item);
													}}
													class="ml-auto flex w-8 items-center justify-center bg-gray-50 hover:bg-gray-100"
												>
													<Icons type="minus" strokeColor="#333" />
												</button>
												<div
													class="flex h-full items-center border-l border-r border-black/20 px-4 text-sm"
												>
													{item.node.quantity} st
												</div>
												<button
													on:click={() => {
														addOneItem(item);
													}}
													class="flex w-8 items-center justify-center bg-gray-50 hover:bg-gray-100"
												>
													<Icons type="plus" strokeColor="#333" />
												</button>
											</div>
											<div class="ml-auto">
												<span class="font-medium">{formatPrice(item.node.cost.totalAmount)}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			{#if items.length !== 0}
				<Drawer.Footer>
					<Button on:click={checkout}>
						<span> Till betalning </span>
						<div class="mr-2 flex h-8 w-8 items-center text-2xl">
							{#if $isCartLoading}
								<Icons type="loading" />
							{:else}
								<Icons type="cart-checkout" />
							{/if}
						</div></Button
					>
					<Drawer.Close asChild let:builder>
						<Button builders={[builder]} variant="outline">Fortsätt shoppa</Button>
					</Drawer.Close>
				</Drawer.Footer>
			{/if}
		</div>
	</Drawer.Content>
</Drawer.Root>
