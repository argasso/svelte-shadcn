<script lang="ts">
	import { Drawer as DrawerPrimitive, type DrawerDirection } from 'vaul-svelte';
	import DrawerOverlay from './drawer-overlay.svelte';
	import { cn } from '$lib/utils.js';

	type $$Props = DrawerPrimitive.ContentProps & {
		direction?: DrawerDirection;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let direction: DrawerDirection = 'bottom';
</script>

<DrawerPrimitive.Portal>
	<DrawerOverlay />
	<DrawerPrimitive.Content
		class={cn(
			'fixed z-50 flex border bg-background p-4',
			direction === 'bottom'
				? 'bottom-0 left-0 right-0 h-[75%] flex-col rounded-t-[10px] md:h-[50%]'
				: '',
			direction === 'top'
				? 'left-0 right-0 top-0 h-[75%] flex-col rounded-b-[10px] md:h-[50%]'
				: '',
			direction === 'left'
				? 'bottom-0 left-0 top-0 w-[95%] flex-row rounded-r-[10px] md:w-[50%]'
				: '',
			direction === 'right'
				? 'bottom-0 right-0 top-0 w-[95%] flex-row rounded-l-[10px] md:w-[50%]'
				: '',
			className
		)}
		{...$$restProps}
	>
		<div
			class={cn(
				'flex h-full w-full gap-8 rounded-full',
				direction === 'bottom' ? 'flex-col' : '',
				direction === 'top' ? 'flex-col-reverse' : '',
				direction === 'left' ? 'flex-row-reverse' : '',
				direction === 'right' ? 'flex-row ' : ''
			)}
		>
			<div
				class={cn(
					'rounded-full bg-zinc-300',
					direction === 'top' || direction === 'bottom' ? 'mx-auto h-1.5 w-12' : '',
					direction === 'left' || direction === 'right' ? 'my-auto h-12 w-1.5' : ''
				)}
			/>
			<div class="grid h-full w-full place-content-center">
				<!-- <CenteredContent> -->
				<slot />
				<!-- </CenteredContent> -->
			</div>
		</div>
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
