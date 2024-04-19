<script lang="ts">
	import Link from './Link.svelte';
	import * as Card from '$lib/components/ui/card';
	let className = '';
	export { className as class };
	export let title: string;
	export let links: { href: string; name: string }[] = [];
</script>

{#if links.length > 0}
	<Card.Root>
		<Card.Header>
			<Card.Title>{title}</Card.Title>
		</Card.Header>
		<Card.CardContent class={className}>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1">
				{#each links as link}
					<div class="my-1">
						{#if link.href}
							<Link href={link.href}>
								{link.name}
							</Link>
						{:else}
							{link.name}
						{/if}
					</div>
				{/each}
			</div>
		</Card.CardContent>
	</Card.Root>
{:else}
	<div class="mt-10 w-full flex-shrink-0 justify-start"></div>
{/if}
