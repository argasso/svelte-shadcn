<script lang="ts">
  let className = ''
  export { className as class }
  export let strokeColor = 'currentColor'
  export let type:
    | 'star'
    | 'cart'
    | 'cart-add'
    | 'cart-heart'
    | 'cart-checkout'
    | 'close'
    | 'minus'
    | 'plus'
    | 'menu'
    | 'search'
    | 'arrowLeft'
    | 'arrowRight'
    | 'caretRight'
    | 'loading'
    | 'book-missing'
    | 'checked'
</script>

{#if type === 'star'}
  <svg
    class={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      d="M12.43 8L10 0L7.57 8H0L6.18 12.41L3.83 20L10 15.31L16.18 20L13.83 12.41L20 8H12.43Z"
    /></svg
  >
{:else if type === 'cart'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"
    /></svg
  >
{:else if type === 'cart-add'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3M7 18c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m10 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-9.8-3.2v-.1l.9-1.7h7.4c.7 0 1.4-.4 1.7-1l3.9-7l-1.7-1l-3.9 7h-7L4.3 2H1v2h2l3.6 7.6L5.2 14c-.1.3-.2.6-.2 1c0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2"
    /></svg
  >
{:else if type === 'cart-heart'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M9 20c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m8-2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-9.8-3.2v-.1l.9-1.7h7.4c.7 0 1.4-.4 1.7-1l3.9-7l-1.7-1l-3.9 7h-7L4.3 2H1v2h2l3.6 7.6L5.2 14c-.1.3-.2.6-.2 1c0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.2-.1-.2-.2M12 9.3l-.6-.5C9.4 6.9 8 5.7 8 4.2C8 3 9 2 10.2 2c.7 0 1.4.3 1.8.8c.4-.5 1.1-.8 1.8-.8C15 2 16 2.9 16 4.2c0 1.5-1.4 2.7-3.4 4.6z"
    /></svg
  >{:else if type === 'cart-checkout'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M9 20a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2m8-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-9.8-3.37c-.01.04-.01.08 0 .12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.07-.69.24-1l1.36-2.41L3 4H1V2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5L17.3 12c-.36.62-1.03 1-1.75 1H8.1zM9 9.5h4v2l3-3l-3-3v2H9z"
    /></svg
  >
{:else if type === 'close'}
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke={strokeColor}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    shape-rendering="geometricPrecision"
    class="hover:text-accent-3 h-6 w-6 {className}"
    ><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg
  >
{:else if type === 'minus'}
  <svg class={className} width="18" height="18" viewBox="0 0 24 24" fill="none"
    ><path
      d="M5 12H19"
      stroke={strokeColor}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{:else if type === 'plus'}
  <svg class={className} width="18" height="18" viewBox="0 0 24 24" fill="none"
    ><path
      d="M12 5V19"
      stroke={strokeColor}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    /><path
      d="M5 12H19"
      stroke={strokeColor}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{:else if type === 'menu'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 {className}"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#fff"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16m-7 6h7"
    /></svg
  >
{:else if type === 'search'}
  <svg class={className} viewBox="0 0 24 24">
    <path
      fill={strokeColor}
      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
    />
  </svg>
{:else if type === 'arrowLeft'}
  <svg class={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor}
    ><path d="M19 12H5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path
      d="M12 19L5 12L12 5"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{:else if type === 'arrowRight'}
  <svg
    class={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={strokeColor}
    xmlns="http://www.w3.org/2000/svg"
    ><path d="M5 12H19" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path
      d="M12 5L19 12L12 19"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{:else if type === 'caretRight'}
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke={strokeColor}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    shape-rendering="geometricPrecision"
    class={className}><path d="M9 18l6-6-6-6" /></svg
  >
{:else if type === 'loading'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    ><circle cx="4" cy="12" r="3" fill="currentColor"
      ><animate
        id="svgSpinners3DotsScale0"
        attributeName="r"
        begin="0;svgSpinners3DotsScale1.end-0.25s"
        dur="0.75s"
        values="3;.2;3"
      /></circle
    ><circle cx="12" cy="12" r="3" fill="currentColor"
      ><animate
        attributeName="r"
        begin="svgSpinners3DotsScale0.end-0.6s"
        dur="0.75s"
        values="3;.2;3"
      /></circle
    ><circle cx="20" cy="12" r="3" fill="currentColor"
      ><animate
        id="svgSpinners3DotsScale1"
        attributeName="r"
        begin="svgSpinners3DotsScale0.end-0.45s"
        dur="0.75s"
        values="3;.2;3"
      /></circle
    ></svg
  >
{:else if type === 'book-missing'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    ><path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 5.899-1.096M3 6a9 9 0 0 1 2.114-.884m3.8-.21C9.984 5.076 11.03 5.44 12 6a9 9 0 0 1 9 0M3 6v13m9-13v2m0 4v7m9-13v11M3 3l18 18"
    /></svg
  >
{:else if type === 'checked'}
  <svg
    class={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"
    /></svg
  >
{/if}
