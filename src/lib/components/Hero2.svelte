<script lang="ts">
  import Wave from './Wave.svelte'
  import Button from './ui/button/button.svelte'

  export let title: string | null | undefined = 'VÄLKOMMEN TILL ARGASSO BOKFÖRLAG'
  export let intro: string = 'Lätt att läsa för barn och ungdomar'
</script>

<div class="text-white">
  <div class="container flex flex-col flex-wrap items-center md:flex-row">
    <div
      class="flex w-full flex-col items-start justify-center text-center md:w-3/5 md:pr-10 md:text-left"
    >
      <h1 class="my-8 text-4xl">
        <div class="my-3 w-full text-base font-light uppercase tracking-wide">
          {title}
        </div>
        {intro}
      </h1>
      <Button href="/boecker" size="lg" class="">Se alla våra böcker</Button>
    </div>
    <div class="-m-10 w-full p-10 pb-20 opacity-70 md:w-2/5 md:p-0 md:pb-6">
      <!-- <img class="object-contain md:max-h-64" src="/hero.png" alt="Bild på böcker från Argasso" /> -->
    </div>
  </div>
  <Wave />
</div>
