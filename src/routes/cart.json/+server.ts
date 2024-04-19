// import { createCart, addToCart, updateCart } from '../../utils/shopify.js';
import { CartLinesUpdateStore, CartCreateStore, CartLinesAddStore } from '$houdini'
import { error, json } from '@sveltejs/kit'

export async function POST() {
  const store = new CartCreateStore()
  await store.mutate({})
  return json({})

  // await createCart()
  // return new Response({ data: {} })
}

export async function PUT(event) {
  const store = new CartLinesUpdateStore()
  const body = await event.request.json()
  const cartId = body.cartId as string
  const lineId = body.lineId as string
  const variantId = body.variantId as string
  const quantity = body.quantity as number
  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ],
  }

  const { data } = await store.mutate(variables, { event })
  return json(data)
  // if (response.status === 200) {
  //   return new Response({ data: response.body.data })
  // } else {
  //   throw error(response.status)
  // }

  // const body = await request.json()
  // const response = await updateCart(body)

  // if (response.status === 200) {
  //   return new Response({ data: response.body.data })
  // } else {
  //   throw error(response.status)
  // }
}

export async function PATCH(event) {
  const store = new CartLinesAddStore()
  const body = await event.request.json()
  const cartId = body.cartId as string
  const variantId = body.variantId as string
  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity: 1,
      },
    ],
  }
  const { data, errors } = await store.mutate(variables, { event })
  if (errors) {
    throw error(400)
  }
  return json(data)

  // const body = await request.json()
  // const response = await addToCart(body)
  // if (response.status === 200) {
  //   return new Response({ data: response.body.data })
  // } else {
  //   throw error(response.status)
  // }
}
