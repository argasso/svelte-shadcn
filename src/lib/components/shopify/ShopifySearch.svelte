<script lang="ts">
	import Circle from 'svelte-radix/Circle.svelte';
	import File from 'svelte-radix/File.svelte';
	import Laptop from 'svelte-radix/Laptop.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import { onMount } from 'svelte';
	import { resetMode, setMode } from 'mode-watcher';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { PredictiveSearchStore, type PredictiveSearch$result } from '$houdini';
	import { bookUrl } from '$lib';
	import ShopifyImage from './ShopifyImage.svelte';
	import Icons from './Icons.svelte';

	export { className as class };
	let className: string = '';
	let open = false;

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = true;
			}
		}
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function runCommand(cmd: () => void) {
		open = false;
		cmd();
	}

	const search = new PredictiveSearchStore();

	let searchTerm = '';
	let results: NonNullable<PredictiveSearch$result['predictiveSearch']>['products'] = [];

	async function onInput(query: string) {
		console.log('onInput', searchTerm);

		if (searchTerm.length) {
			const response = await search.fetch({
				variables: { query },
				policy: 'CacheAndNetwork'
			});
			results = response.data?.predictiveSearch?.products || [];
		} else {
			results = [];
		}
	}

	$: onInput(searchTerm);
</script>

<Button
	variant="outline"
	class={cn(
		'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
		className
	)}
	on:click={() => (open = true)}
	{...$$restProps}
>
	<span class="hidden lg:inline-flex"> Sök böcker... </span>
	<span class="inline-flex lg:hidden">Sök...</span>
	<kbd
		class="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
	>
		<span class="text-xs">⌘</span>K
	</kbd>
</Button>
<Command.Dialog bind:open shouldFilter={false}>
	<Command.Input placeholder="Sök titel" bind:value={searchTerm} />
	<Command.List>
		<Command.Empty>
			{#if searchTerm.length > 0}
				Hittar ingenting som motsvarar sökningen.
			{:else}
				Skriv något att söka efter
			{/if}
		</Command.Empty>
		{#if results.length > 0}
			<Command.Group heading={`Hittade ${results.length} böcker`}>
				{#each results as product}
					<Command.Item
						value={product.handle}
						onSelect={() =>
							runCommand(() => {
								product.handle && goto(bookUrl(product.handle));
							})}
					>
						<ShopifyImage image={product.images.nodes[0]} height={40} />
						{product.title}
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
