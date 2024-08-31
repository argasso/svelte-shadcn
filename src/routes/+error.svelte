<script>
  import { page } from '$app/stores'
  import Button from '$lib/components/ui/button/button.svelte'

  $: message = $page.error?.message ?? 'Oj, något gick fel'
  $: status = $page.status
</script>

<div class="container py-14">
  <div class="flex flex-col items-center justify-between text-gray-700 md:flex-row">
    <div class="w-full">
      <h1 class="">
        <div class="flex items-center gap-4 sm:justify-start sm:pt-0">
          <div class="tracking-wider">{status}</div>
          <div class="flex-0 border-argasso2-500 items-stretch self-stretch border-2"></div>
          <div class="">{message}</div>
        </div>
      </h1>
      <p class="py-6">
        Det kan bero på ett stavfel, att sidan inte finns eller att den flyttats. Du kan prova att
        gå tillbaka till startsidan.
      </p>
      <Button href="/" variant="default">Tillbaka till startsidan</Button>
    </div>
    <!-- <div>Bild</div> -->
  </div>
</div>
