<script lang="ts">
  let className = ''
  export { className as class }
  export let inversed = false
  $: rotate = inversed ? 'rotate-180' : ''
</script>

<div class="clip-wave h-20 w-full lg:h-20 {rotate}">
  <svg width="0" height="0">
    <defs>
      <clipPath
        id="clipWave"
        clipPathUnits="objectBoundingBox"
        transform="translate(-1, 37) scale(0.000695, 0.0055)"
      >
        <path
          d="m 0.457 34.035 c 56.629 19.163 97.751 31.774 123.365 37.83 c 57.632 13.63 110.473 18.425 148.211 21.594 c 39.322 3.3 124.602 2.342 188.992 -1.796 c 25.735 -1.653 57.702 -5.291 95.901 -10.911 c 38.821 -6.156 65.446 -10.744 79.873 -13.761 c 27.114 -5.667 75.702 -17.488 90.806 -20.863 c 52.865 -11.811 91.234 -23.596 128.719 -30.224 c 66.365 -11.735 99.352 -13.382 154.861 -15.472 c 49.52 1.045 86.205 2.697 110.051 4.955 c 40.467 3.832 87.385 12.434 114.164 16.917 c 50.455 8.444 118.951 25.128 205.486 50.05 l -0.886 -222.354 l -1440 -2 l 0.457 86.035 z"
        />
      </clipPath>
    </defs>
  </svg>
  <svg
    class="h-full w-full {className}"
    preserveAspectRatio="none"
    viewBox="0 0 1428 174"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g stroke="none" stroke-width="1" fill="none" fill-rule="nonzero">
      <g class="fill-background" transform="translate(-2, 44)" fill-rule="nonzero">
        <path
          d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
          opacity="0.100000001"
        />
        <path
          d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
          opacity="0.100000001"
        />
        <path
          d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
          id="Path-4"
          opacity="0.200000003"
        />
      </g>
    </g>
  </svg>
</div>

<style lang="postcss">
  .fill-background {
    fill: 'hsl(var(--background) / <alpha-value>)';
  }
  .clip-wave {
    clip-path: url(#clipWave);
    -webkit-clip-path: url(#clipWave);
  }
</style>
