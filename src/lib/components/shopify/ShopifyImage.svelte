<script context="module" lang="ts">
  export type ImageProp =
    | {
        url: string
        altText: string | null
        height: number | null
        width: number | null
      }
    | null
    | undefined
</script>

<script lang="ts">
  import { Image, type ImageProps } from '@unpic/svelte'
  import PlaceholderBook from './PlaceholderBook.svelte'
  import type { HTMLImgAttributes } from 'svelte/elements'

  interface $$Props extends HTMLImgAttributes {
    image: ImageProp
    width?: number
    height?: number
  }

  $: ({ image, width, height, ...rest } = $$restProps)
  $: props = imageProps(image, width, height)

  function imageProps(
    image: ImageProp,
    scaleWidth?: number,
    scaleHeight?: number,
  ): ImageProps | undefined {
    if (!image) {
      return
    }
    const layout = 'constrained'
    const { url: src, altText: alt = '' } = image
    if (image.width && image.height) {
      if (scaleWidth && !scaleHeight) {
        const height = Math.floor((scaleWidth / image.width) * image.height)
        const width = scaleWidth
        return { src, alt, height, width }
      } else if (!scaleWidth && scaleHeight) {
        const width = Math.floor((scaleHeight / image.height) * image.width)
        const height = scaleHeight
        return { layout, src, alt, height, width }
      }
      const { width, height } = image
      return { layout, src, alt, height, width }
    }
    const aspectRatio = 1
    return { layout: 'fullWidth', src, alt, aspectRatio }
  }
</script>

{#if image && props}
  <Image {...rest} {...props} />
{:else}
  <PlaceholderBook {...rest} {width} />
{/if}
