<script lang="ts">
  let className = ''
  export { className as class }
  export let title: string | null | undefined = undefined
  export let level: 1 | 2 | 3 = 1
</script>

<section class="py-12 {className}">
  <div class="container">
    {#if title}
      {#if level === 1}
        <h1 class="mb-8 mt-0 w-full text-center md:text-left">
          {title}
        </h1>
      {:else if level === 2}
        <h2 class="mb-8 mt-0 w-full text-center md:text-left">
          {title}
        </h2>
      {:else if level === 3}
        <h3 class="mb-8 mt-0 w-full text-center md:text-left">
          {title}
        </h3>
      {/if}
      <!-- <div class="mb-12 w-full">
        <div
          class="gradient mx-auto my-0 h-1 max-w-xs rounded-t-3xl py-0 opacity-30 md:max-w-full md:bg-transparent md:bg-gradient-to-r md:from-primary"
        />
      </div> -->
    {/if}
    <slot />
  </div>
</section>
