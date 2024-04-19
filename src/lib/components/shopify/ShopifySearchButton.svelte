<script lang="ts">
	// import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import { browser } from '$app/environment';
	import Icons from './Icons.svelte';

	// Local
	let isOsMac = false;
	// const modalStore = getModalStore()

	// Set Search Keyboard Shortcut
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}

	// Search
	function triggerSearch(): void {
		// const modal: ModalSettings = {
		//   type: 'component',
		//   component: 'modalSearch',
		//   position: 'item-start',
		// }
		// modalStore.trigger(modal)
	}
</script>

<button
	class="btn variant-soft hover:variant-soft-primary space-x-4 text-white hover:text-white"
	on:click={triggerSearch}
>
	<Icons type="search" />
	<small class="hidden md:inline-block">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
</button>
