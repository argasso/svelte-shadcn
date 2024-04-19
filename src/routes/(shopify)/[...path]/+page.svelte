<script lang="ts">
	import { page } from '$app/stores';
	import LinkList from '$lib/components/LinkList.svelte';
	import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText.js';
	import { resolveHrefs } from '$lib';

	export let data;

	$: ({ Pages, Page } = data);

	$: pages = resolveHrefs([
		...($Pages.data?.pages.nodes || []),
		...($Pages.data?.categories.nodes || [])
	]);

	$: pageData = $Page.data?.page ?? $Page.data?.category;

	$: categories = pages
		.filter((p) => p.parent === pageData?.id)
		.map(({ name, title, href }) => ({
			name: name ?? title ?? '?',
			href
		}));

	$: heading = pageData?.title?.value ?? pageData?.name?.value;
	$: html = pageData?.content?.value
		? convertSchemaToHtml(JSON.parse(pageData.content?.value))
		: undefined;
</script>

<div class="container mb-10">
	<div class="flex flex-col items-start gap-10 md:flex-row">
		<div class="flex-auto">
			<h1>{heading}</h1>
			{#if html}
				<div>{@html html}</div>
			{/if}
		</div>
		<LinkList class="w-full xl:w-64" title="Avdelningar" links={categories} />
	</div>
</div>
