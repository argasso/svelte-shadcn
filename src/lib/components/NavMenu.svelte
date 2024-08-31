<script lang="ts">
  import type { MenuItem } from '$lib/menu'
  import NavMenuItem from './NavMenuItem.svelte'

  let className = ''
  export { className as class }
  export let menu: MenuItem

  $: menuItems = menu?.children ?? []
  $: rootItem = { ...menu, children: [] }
</script>

<ul class="list-none pl-0 {className}">
  <div class="border-b border-border">
    <NavMenuItem menuItem={rootItem} />
    {#each menuItems as menuItem}
      <NavMenuItem {menuItem} />
    {/each}
  </div>
</ul>
