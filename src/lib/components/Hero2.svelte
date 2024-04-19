<script lang="ts">
  import Wave from './Wave.svelte'

  export let title: string | null | undefined = 'VÄLKOMMEN TILL ARGASSO BOKFÖRLAG'
  export let intro: string = 'Lätt att läsa för barn och ungdomar'
</script>

<div class="text-white">
  <div class="container flex flex-col flex-wrap items-center md:flex-row">
    <div class="flex w-full flex-col items-start justify-center text-center md:w-3/5 md:pr-10 md:text-left">
      <h1 class="my-8 text-4xl">
        <div class="my-3 w-full text-base font-light uppercase tracking-wide">
          {title}
        </div>
        {intro}
      </h1>
      <a
        href="/boecker"
        class="focus:shadow-outline mx-auto my-2 rounded-full bg-white px-8 py-4 font-bold text-gray-800 shadow-lg hover:bg-argasso-100 active:bg-white lg:mx-0"
      >
        Se alla våra böcker
      </a>
    </div>
    <div class="w-full p-10 pb-20 md:w-2/5 md:p-0 md:pb-6 -m-10 opacity-70">
      <!-- <img class="object-contain md:max-h-64" src="/hero.png" alt="Bild på böcker från Argasso" /> -->
    </div>
  </div>
  <Wave />
</div>
