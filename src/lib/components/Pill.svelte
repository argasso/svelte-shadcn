<script lang="ts">
  export let href: string
  export let name: string
</script>

<span
  class="mb-1 mr-1 inline-block rounded-full bg-stone-200 px-2 py-1 text-center text-xs uppercase text-slate-700 last:mr-0"
>
  <a {href}>{name}</a>
</span>
