import { load_Page } from '$houdini'

export const load = async (event) => {
  const { url, parent } = event
  const handle = url.pathname.split('/').at(-1) ?? ''

  const { Pages } = await parent()

  const variables = { handle }
  return {
    Pages,
    ...(await load_Page({ event, variables })),
  }
}
