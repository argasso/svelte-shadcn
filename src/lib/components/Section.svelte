<script lang="ts">
  let className = ''
  export { className as class }
  export let title: string | undefined
</script>

<section class="py-8 {className}">
  <div class="container">
    {#if title}
      <h2 class="mt-0 w-full text-center text-4xl md:text-left">
        {title}
      </h2>
      <div class="mb-12 w-full">
        <div
          class="gradient mx-auto my-0 h-1 max-w-xs rounded-t-3xl py-0 opacity-50 md:max-w-full md:bg-transparent md:bg-gradient-to-r md:from-argasso2-500"
        />
      </div>
    {/if}
    <slot />
  </div>
</section>
