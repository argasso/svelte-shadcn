import { load_Page } from '$houdini'

export const load = async (event) => {

  const {Page} = await load_Page({event, variables: { handle: 'startsida' }})
  return {
    Page
  }
}
