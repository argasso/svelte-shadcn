import { HoudiniClient } from '$houdini'

export default new HoudiniClient({
  url: '/shopify',

  // uncomment this to configure the network call (for things like authentication)
  // for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
  fetchParams() {
    return {
      // headers: {
      //   'X-Shopify-Storefront-Access-Token': 'ff151810f966c1536e2d3b4fd437f38e',
      // },
    }
  },
})
