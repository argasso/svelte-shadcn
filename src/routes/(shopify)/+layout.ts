import { load_Filters } from '$houdini'
import { get } from 'svelte/store'

export const load = async (event) => {
  const { Filters } = await load_Filters({
    event,
  })

  const initialFilters = get(Filters).data?.filters?.products.filters ?? []

  return {
    initialFilters,
  }
}
