<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import type { ArgassoFilter } from './shopifyFilters';
	import { getQueryStore } from '$lib/stores/URLSearchParamsStore';

	export let filter: ArgassoFilter;

	const key = filter.values.at(0)?.key ?? 'price';
	const query = getQueryStore(key);

	const [min, max] = filter.values.map((v) => parseFloat(v.value));

	let range = [min, max];
	$: unset = range[0] === min && range[1] === max;

	function stop() {
		if (unset) {
			$query = [];
		} else {
			$query = [...range.map(String)];
		}
	}
</script>

<div class="pb-2">
	<div class="flex justify-between">
		<div>
			<label class="text-sm font-light" for={`${filter.id}-min`}>som lägst</label>
			<div>
				<input
					class="h-8 w-20 rounded"
					type="number"
					name="min"
					id={`${filter.id}-min`}
					bind:value={range[0]}
				/>
			</div>
		</div>
		<div>
			<label class="text-sm font-light" for={`${filter.id}-max`}>som högst</label>
			<div>
				<input
					class="h-8 w-20 rounded"
					type="number"
					name="max"
					id={`${filter.id}-max`}
					bind:value={range[1]}
				/>
			</div>
		</div>
	</div>
	<div class:unset>
		<Slider value={range} {min} {max} step={1} />
		<!-- <RangeSlider bind:values={range} on:stop={stop} {min} {max} range pushy /> -->
	</div>
</div>

<style lang="postcss">
	:root {
		/* --range-handle-inactive: theme('colors.argasso.600');
		--range-handle: theme('colors.argasso.600');
		--range-handle-focus: theme('colors.argasso.600');
		--range-handle-border: theme('colors.argasso.600');
		--range-range-inactive: theme('colors.argasso.600');
		--range-range: theme('colors.argasso.600');
		--range-float: theme('colors.argasso.600'); */
	}
	.unset {
		--range-handle-inactive: hsl(180, 4.6%, 61.8%);
		--range-handle: hsl(180, 4.6%, 61.8%);
		--range-handle-focus: hsl(180, 4.6%, 61.8%);
		--range-handle-border: hsl(180, 4.6%, 61.8%);
		--range-range-inactive: hsl(180, 4.6%, 61.8%);
		--range-range: hsl(180, 4.6%, 61.8%);
		--range-float: hsl(180, 4.6%, 61.8%);
	}
</style>
