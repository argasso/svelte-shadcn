import { CartCreateStore, CartLinesAddStore, CartLinesUpdateStore, CartStore, type PriceFragment$data } from '$houdini';
import { toast } from "svelte-sonner";
import { derived, writable } from 'svelte/store';
import { parseJSON } from '.';
import { cartQuantity } from './stores/store';

export const cartStore = new CartStore();
const cartCreateStore = new CartCreateStore();
const cartLinesAddStore = new CartLinesAddStore();
const cartLinesUpdateStore = new CartLinesUpdateStore();

export const isCartLoading = derived(
	[cartStore, cartCreateStore, cartLinesAddStore, cartLinesUpdateStore],
	([a$, b$, c$, $d]) => a$.fetching || b$.fetching || c$.fetching || $d.fetching
);

export const flashCart = writable(false);
export const cartOpen = writable(false);

type AddToCartInfo = {
	title?: string | null;
	price: PriceFragment$data;
	image?: { url: string } | null;
};
export const addToCartInfo = writable<AddToCartInfo | undefined>(undefined);

export const addToCartLoading = writable<string | undefined>(undefined);

function isCartExpired(updatedAt: string) {
	const difference = Date.now() - new Date(updatedAt).getTime();
	const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
	return totalDays > 6;
}

export const refreshCart = async () => {
	let cart = undefined
	const cartId = parseJSON(localStorage.getItem('cartId'));

	if (cartId) {
		const response = await cartStore.fetch({ variables: { cartId } });
		if (response.data?.cart && !isCartExpired(response.data.cart.updatedAt)) {
			cart = response.data.cart
		} 
	}
	if (!cart) {
		const response = await cartCreateStore.mutate({});
		cart  = response.data?.cartCreate?.cart
		failOnErrors('Failed to create cart', response.errors);
		localStorage.setItem('cartId', JSON.stringify(cart?.id));
		localStorage.setItem('cartUrl', JSON.stringify(cart?.checkoutUrl));
	}
	let sum = 0;
	cart?.lines?.edges?.forEach((d) => {
		sum += d.node.quantity;
	});
	cartQuantity.set(sum);
	return cart;
};

export async function initiateCart() {
	if (typeof window !== 'undefined') {
		await refreshCart();
		// document.addEventListener('keydown', (e) => {
		//   const keyCode = e.keyCode
		//   if (keyCode === 27) {
		//     $isCartOpen = false
		//   }
		// })
	}
}

export function getCheckoutUrl() {
	return parseJSON(localStorage.getItem('cartUrl'));
}

export async function addToCart(variantId: string, info?: AddToCartInfo) {

	addToCartLoading.set(variantId);
	if (info) {
		addToCartInfo.set(info);
		setTimeout(() => addToCartInfo.set(undefined), 2000);
	}
	const cartId = getLocalStorageCartId();
	const response = await cartLinesAddStore.mutate({
		cartId,
		lines: [
			{
				merchandiseId: variantId,
				quantity: 1
			}
		]
	});
	addToCartLoading.set(undefined);
	failOnErrors('Failed to add to cart', response.errors);

	toast.success("Lade följande bok i varukorgen", {
		position: 'top-right',
		icon: undefined,
		description: `${info?.title}`,
		action: {
			label: "Visa Varukorg",
			onClick: () => cartOpen.set(true) 
		}
	})
}

export async function updateCart({
	lineId,
	quantity,
	variantId
}: {
	lineId: string;
	quantity: number;
	variantId: string;
}) {
	const cartId = getLocalStorageCartId();
	const variables = {
		cartId,
		lines: [
			{
				id: lineId,
				merchandiseId: variantId,
				quantity
			}
		]
	};

	const response = await cartLinesUpdateStore.mutate(variables);

	failOnErrors('Failed to update cart', response.errors);

	// return refreshCart();
}

function failOnErrors(message: string, errors: { message: string }[] | null) {
	if (errors) {
		console.error(message, errors);
		throw Error(message);
	}
}

function getLocalStorageCartId() {
	if (typeof window !== 'undefined') {
		return parseJSON(localStorage.getItem('cartId'));
	}
}
