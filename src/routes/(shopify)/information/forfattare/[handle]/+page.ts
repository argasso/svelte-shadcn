import { load_Author, load_Products } from '$houdini'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

export const load = async (event) => {
  const { handle } = event.params
  const { Author } = await load_Author({
    event,
    variables: {
      handle: { handle, type: 'author' },
    },
  })

  const authorData = get(Author).data

  if (!authorData?.author) {
    error(404, 'Oj, vi hittar inte denna författare.')
  }

  return {
    Author,
    ...(await load_Products({
      event,
      variables: {
        filters: [
          {
            productMetafield: {
              namespace: 'custom',
              key: 'authors',
              value: authorData.author.id,
            },
          },
        ],
        first: 30,
      },
    })),
  }
}

// export const _houdini_load = graphql(`
// `)

// export const _AuthorVariables: AuthorVariables = ({ params }) => {
//   console.log('_ProductsVariables params', params)
//   const { handle } = params
//   if (!handle) {
//     throw error(400, 'Oj, vi hittar inte denna författare.')
//   }

//   const variables = {
//     handle: {
//       handle,
//       type: 'author',
//     },
//   }
//   console.log('_ProductsVariables variables', variables)

//   return variables
// }
