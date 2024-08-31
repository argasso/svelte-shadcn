<script lang="ts">
  import Icons from './Icons.svelte'

  const DEFAULT_WIDTH = 130

  let className = ''
  export { className as class }
  export let width: number | undefined = undefined
  export let height: number | undefined = undefined
  $: w = width ?? (height ? height / 1.5 : DEFAULT_WIDTH)
  $: h = height ?? (width ? width * 1.5 : DEFAULT_WIDTH * 1.5)
</script>

<div
  style="width: {w}px; height: {h}px"
  class="flex flex-col items-center justify-center text-slate-200 {className}"
>
  <Icons class="text-7xl " type="book-missing" />
  <div class="text-center uppercase text-gray-300">Omslagsbild saknas</div>
</div>
