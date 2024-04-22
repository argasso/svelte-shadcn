<script lang="ts">
  import type { MenuItem } from '../../../routes/+layout'
  import NavMenuItem from './NavMenuItem.svelte'

  let className = ''
  export { className as class }
  export let menuItems: MenuItem[]
</script>

<ul class="list-none pl-0 {className}">
  <div class="border-b border-[color:var(--menu-border-color)]">
    {#each menuItems as menuItem}
      <NavMenuItem {menuItem} />
    {/each}
  </div>
</ul>

<style lang="postcss">
  :root {
    --menu-accent-color: theme('textColor.argasso2.100');
    --menu-border-color: theme('borderColor.gray.300');
  }
</style>
