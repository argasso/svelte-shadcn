<script lang="ts">
	import { page } from '$app/stores';
	export let href: string;
	export let exact = false;
	$: active =
		$page.url.pathname && href && exact
			? $page.url.pathname === href
			: $page.url.pathname.includes(href);
</script>

<a {href} class:active class="flex">
	<span class="my-auto">
		<slot />
	</span>
</a>

<style lang="postcss">
	a.active {
		@apply mb-[1px] mt-[5px] border-b-4;
	}
</style>
