import { graphql } from '$houdini'
import { error } from '@sveltejs/kit'
import type { AfterLoadEvent, ProductVariables } from './$houdini'

const namespace = 'book'

const metafieldLabels = new Map([
  ['category', 'Kategori'],
  ['binding', 'Bindning'],
  ['edited_by', 'Redigering'],
  ['illustrations_by', 'Illustrationer'],
  ['recommened_age', 'Rekommenderad ålder'],
  ['number_of_pages', 'Antal sidor'],
  ['publish_month', 'Utgivningsmånad'],
  ['original_title', 'Orginaltitel'],
  ['translated_by', 'Översättning'],
  ['narrated_by', 'Uppläsare'],
  ['duration', 'Speltid'],
  ['contains', 'Innehåller'],
  ['reading_level', 'Lättlästnivå'],
])

const metafieldIds = [...metafieldLabels.keys()].map((key) => ({ key, namespace }))

export const _houdini_load = graphql(`
  query Product($handle: String!, $metafieldIds: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      options {
        id
        name
        values
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      ...AuthorsFragment
      images(first: 1) {
        nodes {
          url
          altText
          height
          width
        }
      }
      variants(first: 3) {
        nodes {
          id
          sku
          title
          barcode
          price {
            ...PriceFragment @mask_disable
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            height
            width
          }
          discontinued: metafield(namespace: "book", key: "discontinued") {
            value
          }
          metafields(identifiers: $metafieldIds) {
            key
            value
            type
            references(first: 3) {
              nodes {
                ... on Metaobject {
                  handle
                  title: field(key: "title") {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`)

export function _houdini_afterLoad({ data }: AfterLoadEvent) {
  const { product } = data.Product
  if (!product) {
    throw error(404, 'Oj, vi hittar inte denna bok.')
  }
  return {
    metafieldLabels,
  }
}

export const _ProductVariables: ProductVariables = ({ params }) => {
  const { handle } = params
  if (!handle) {
    throw error(400, 'Oj, vi hittar inte denna bok.')
  }

  return {
    handle,
    metafieldIds,
  }
}
