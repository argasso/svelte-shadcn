/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  watchSchema: {
    url: 'https://argasso.myshopify.com/api/2024-10/graphql',
    headers: {
      'X-Shopify-Storefront-Access-Token': 'ff151810f966c1536e2d3b4fd437f38e',
    },
  },
  plugins: {
    'houdini-svelte': {},
  },
  defaultPaginateMode: 'SinglePage',
  // defaultCachePolicy: 'NetworkOnly',
  // features: {
  //   imperativeCache: true,
  // },
  scalars: {
    HTML: {
      type: 'string',
      unmarshal(val) {
        return val
      },
      marshal(date) {
        return date
      },
    },
    Decimal: {
      type: 'string',
      unmarshal(val) {
        return val
      },
      marshal(date) {
        return date
      },
    },
    URL: {
      type: 'string',
      unmarshal(val) {
        return val
      },
      marshal(date) {
        return date
      },
    },
    JSON: {
      type: 'string',
      unmarshal(val) {
        return val
      },
      marshal(date) {
        return date
      },
    },
    DateTime: {
      type: "string",
      unmarshal(val) {
        return val
      },
      marshal(date) {
        return date
      },
    },
  },
}

export default config
