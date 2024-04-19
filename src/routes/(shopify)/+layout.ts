import { load_Pages } from '$houdini'

export const load = async (event) => {
  const { Pages } = await load_Pages({
    event,
  })

  return {
    Pages,
  }
}
