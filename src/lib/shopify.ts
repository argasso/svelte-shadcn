import { CartStore, CartLinesUpdateStore, CartCreateStore, CartLinesAddStore } from '$houdini';
import { derived, writable } from 'svelte/store';
import { cartQuantity } from './stores/store';
import { parseJSON } from '.';

export const cartStore = new CartStore();
const cartCreateStore = new CartCreateStore();
const cartLinesAddStore = new CartLinesAddStore();
const cartLinesUpdateStore = new CartLinesUpdateStore();

export const isCartLoading = derived(
	[cartStore, cartCreateStore, cartLinesAddStore, cartLinesUpdateStore],
	([a$, b$, c$, $d]) => a$.fetching || b$.fetching || c$.fetching || $d.fetching
);

export const flashCart = writable(false);

type AddToCartInfo = {
	title?: string | null;
	price: { amount: string; currencyCode: string };
	image?: { url: string } | null;
};
export const addToCartInfo = writable<AddToCartInfo | undefined>(undefined);

export const addToCartLoading = writable<string | undefined>(undefined);

// export const getCartItems = async () => {
//   const cartId = parseJSON(localStorage.getItem('cartId'))

//   try {
//     const shopifyResponse = await cartStore.fetch({ variables: { cartId }, policy: 'NetworkOnly' })
//     let sum = 0
//     shopifyResponse.data?.cart?.lines?.edges?.forEach((d) => {
//       sum += d.node.quantity
//     })
//     cartQuantity.set(sum)
//     return shopifyResponse
//   } catch (error) {
//     console.log(error)
//   }
// }

export const refreshCart = async () => {
	const cartId = parseJSON(localStorage.getItem('cartId'));

	const response = await cartStore.fetch({ variables: { cartId }, policy: 'CacheAndNetwork' });
	let sum = 0;
	response.data?.cart?.lines?.edges?.forEach((d) => {
		sum += d.node.quantity;
	});
	cartQuantity.set(sum);
	return response;
};

export async function initiateCart() {
	if (typeof window !== 'undefined') {
		const cartId = parseJSON(localStorage.getItem('cartId'));
		const cartCreatedAt = parseJSON(localStorage.getItem('cartCreatedAt'));

		const currentDate = Date.now();
		const difference = currentDate - cartCreatedAt;
		const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
		const cartIdExpired = totalDays > 6;
		if (!cartId || cartIdExpired) {
			const response = await cartCreateStore.mutate({});
			failOnErrors('Failed to create cart', response.errors);
			localStorage.setItem('cartCreatedAt', JSON.stringify(Date.now()));
			localStorage.setItem('cartId', JSON.stringify(response.data?.cartCreate?.cart?.id));
			localStorage.setItem('cartUrl', JSON.stringify(response.data?.cartCreate?.cart?.checkoutUrl));
		}
		const { errors } = await refreshCart();
		failOnErrors('Failed to update cart', errors);
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

	return refreshCart();
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

	return refreshCart();
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
