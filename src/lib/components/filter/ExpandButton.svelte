<script lang="ts">
  export let selectedNumber: number | null
  export let myNumber: number
  export let ariaLabel = 'expand sub menu'
  export let onClick = (): void => {
    if (selectedNumber === myNumber) {
      selectedNumber = null
    } else {
      selectedNumber = myNumber
    }
  }
</script>

<button
  class="flex p-3 pb-4 pt-2"
  on:click|stopPropagation={onClick}
  aria-expanded={selectedNumber === myNumber}
  aria-label={ariaLabel}
>
  <div class="expand-toggle flex-1">
    <span class:open={selectedNumber === myNumber} class="expand-toggle-left" />
  </div>
  <div class="expand-toggle flex-1">
    <span class:open={selectedNumber === myNumber} class="expand-toggle-right" />
  </div>
</button>

<style lang="postcss">
  @keyframes left-open {
    from {
      transform: rotate(45deg);
    }
    to {
      transform: rotate(-45deg);
    }
  }

  @keyframes left-close {
    from {
      transform: rotate(-45deg);
    }
    to {
      transform: rotate(45deg);
    }
  }

  @keyframes right-open {
    from {
      transform: rotate(-45deg);
    }
    to {
      transform: rotate(45deg);
    }
  }

  @keyframes right-close {
    from {
      transform: rotate(45deg);
    }
    to {
      transform: rotate(-45deg);
    }
  }

  .expand-toggle {
    overflow: hidden;
  }

  .expand-toggle-left,
  .expand-toggle-right {
    display: inline-block;
    position: relative;
    background: currentColor;
    height: 3px;
    width: 13px;
    align-items: stretch;
  }

  .expand-toggle-left {
    margin-right: -3px;
    animation-timing-function: linear;
    animation: left-close 0.4s forwards;
    &.open {
      animation: left-open 0.4s forwards;
    }
  }

  .expand-toggle-right {
    margin-left: -3px;
    animation-timing-function: linear;
    animation: right-close 0.4s forwards;
    &.open {
      animation: right-open 0.4s forwards;
    }
  }
</style>
