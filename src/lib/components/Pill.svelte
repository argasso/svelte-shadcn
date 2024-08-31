<script lang="ts">
  export let href: string
  export let name: string
</script>

<span
  class="mb-1 mr-1 inline-block rounded-full bg-accent px-2 py-1 text-center text-xxs uppercase text-foreground last:mr-0"
>
  <a {href}>{name}</a>
</span>
