import { HoudiniClient } from '$houdini'
import { PUBLIC_SHOPIFY_STOREFRONT_TOKEN, PUBLIC_SHOPIFY_STOREFRONT_URL } from '$env/static/public'

const url = PUBLIC_SHOPIFY_STOREFRONT_URL
const headers = {
  headers: {
    'X-Shopify-Storefront-Access-Token': PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? '',
  },
}
export default new HoudiniClient({
  url: '/shopify',
  // uncomment this to configure the network call (for things like authentication)
  // for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
  // fetchParams() {
  //   return {
  //     ...headers
  //   }
  // },
})
