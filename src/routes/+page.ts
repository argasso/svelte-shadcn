import { loadAll, load_Page } from '$houdini'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

export const load = async (event) => {
  // const {
  //   url: { pathname },
  // } = event
  const handle = 'startsida'
  const { Page } = await loadAll(
    load_Page({
      event,
      variables: {
        handle,
      },
    }),
  )
  const pageData = get(Page).data
  const page = pageData?.page
  if (!page) {
    error(404, 'Not found')
  }

  return {
    page,
  }
}
