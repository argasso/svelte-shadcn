import { load_Filters } from '$houdini'

export const load = async (event) => {
  const { Filters } = await load_Filters({
    event,
  })

  return {
    Filters,
  }
}
