<script lang="ts">
  import type { MenuItem } from '../../routes/+layout.svelte'
  import NavMenuItem from './NavMenuItem.svelte'

  let className = ''
  export { className as class }
  export let menuItems: MenuItem[]
</script>

<ul class="list-none pl-0 {className}">
  <div class="border-b border-border">
    {#each menuItems as menuItem}
      <NavMenuItem {menuItem} />
    {/each}
  </div>
</ul>
