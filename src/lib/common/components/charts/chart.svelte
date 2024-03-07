<script lang="ts">
	export let genreForMarket;

	$: genres = genreForMarket.genres.filter((genre) => genre.count > 1);
</script>

<div>
	<h2 class="text-xl font-bold mb-4">
		Top Genres in {genreForMarket.countryName} Playlist
	</h2>
	<div class="flex flex-col space-y-2">
		{#each genres as { genre, count }}
			<div class="flex items-center space-x-2">
				<div class="w-12 h-4 bg-blue-500" style="width: {count}%"></div>
				<p class="text-gray-700">{genre}</p>
			</div>
		{/each}
		<div class="flex items-center space-x-2">
			<div class="w-12 h-4 bg-blue-500" style="width: 1%"></div>
			<p class="text-gray-700">Other</p>
		</div>
	</div>
</div>
