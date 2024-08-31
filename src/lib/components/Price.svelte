<script lang="ts">
  import { fragment, graphql, type PriceFragment } from '$houdini'
  import { formatPrice } from '$lib'

  let className = ''
  export { className as class }
  export let price: PriceFragment

  $: data = fragment(
    price,
    graphql(`
      fragment PriceFragment on MoneyV2 {
        amount
        currencyCode
      }
    `),
  )
</script>

<span class={className}>{formatPrice($data)}</span>
