<script lang="ts">
	import type { SpotifyGenresForMarket } from '$lib/common/types/types';
	import { tooltip } from '@svelte-plugins/tooltips';

	export let genreForMarket: SpotifyGenresForMarket;

	let summarizeGenres = false;

	const getColor = () => {
		const randomColor = Math.floor(Math.random() * 16777215).toString(16);
		return `#${randomColor}`;
	};
</script>

<div class="max-w-full overflow-x-hidden">
	<h2 class="text-xl font-bold mb-4">
		Top Genres in {genreForMarket.countryName} Playlist
	</h2>

	<label>
		<input type="checkbox" bind:checked={summarizeGenres} class="mr-2" />
		Summarize genres with 1 occurrence as "other"
	</label>

	<div class="flex flex-col space-y-2 mt-4">
		<div class="flex items-center space-x-[2px]">
			{#each genreForMarket.genres as { genre, count }}
				{#if !summarizeGenres || (summarizeGenres && count > 1)}
					<div
						use:tooltip={{
							action: 'hover',
							content: `${genre} (${count})`
						}}
						class="w-12 h-4 bg-blue-500"
						style="width: {count}%; background-color: {getColor()}"
					></div>
				{/if}
			{/each}

			{#if summarizeGenres}
				{@const length = genreForMarket.genres.filter((g) => g.count === 1).length ?? 0}
				<div
					use:tooltip={{
						action: 'hover',
						content: `Other (${length} ${length === 1 ? 'genre' : 'genres'}, 1 occurrence each)`
					}}
					class="w-12 h-4 bg-blue-500"
					style="width: 1%; background-color: {getColor()}"
				></div>
			{/if}
		</div>
	</div>
</div>
