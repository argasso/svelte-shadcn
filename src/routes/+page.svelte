<script lang="ts">
  import { MainMenuStore } from '$houdini'
  import Hero2 from '$lib/components/Hero2.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import Wave from '$lib/components/Wave.svelte'
  import { makeMenu } from '$lib/menu.js'

  export let data

  $: ({ Page, MainMenu } = data)
  $: menu = makeMenu($MainMenu.data?.menu)
</script>

{#if $Page?.data?.page}
  <section class="gradient">
    <Hero2 title={$Page.data.page.title?.value} sections={$Page.data.page} />
  </section>
  <Wave class="gradient" />
  <Sections sections={$Page.data.page} {menu} />
{/if}
