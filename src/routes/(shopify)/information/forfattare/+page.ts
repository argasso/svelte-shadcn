import { graphql } from '$houdini'

// export const load = async (event) => {
//   console.log('forfattare load 1')
//   console.log('forfattare load 2')
//   const { Authors } = await loadAll(load_Authors({ event }))
//   console.log('forfattare load 2')
//   const authors = get(Authors)
//   console.log('AuthosStore data', authors.data)
//   console.log('AuthosStore errors', authors.errors)
//   return {
//     Authors,
//   }
// }

export const _houdini_load = graphql(`
  query Authors2 {
    metaobjects(first: 30, type: "Author") {
      nodes {
        id
        handle
        name: field(key: "name") {
          value
        }
        description: field(key: "description") {
          value
        }
        image: field(key: "image") {
          reference {
            ... on MediaImage {
              image {
                altText
                url
                width
                height
              }
            }
          }
        }
        seo {
          title {
            value
          }
          description {
            value
          }
        }
      }
    }
  }
`)
