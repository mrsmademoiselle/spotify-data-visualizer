<script lang="ts">
	import Top50GenresPerCountry from '$lib/common/components/top-50-genres-per-country.svelte';
	import type { Locale, TopGenre } from '$lib/common/types/types';
	import { onMount } from 'svelte';

	let genresForMarket: Map<Locale, Map<string, number>> | undefined;

	onMount(async () => {
		const response = await fetch('/genres');
		const data = await response.json();
		genresForMarket = data.genresForMarket;
	});
</script>

{#if genresForMarket}
	{#each genresForMarket.entries() as entry}
		<Top50GenresPerCountry locale={entry[0]} genresForMarket={entry[1]} />
	{/each}
{/if}
