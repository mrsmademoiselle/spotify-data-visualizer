<script lang="ts">
	import Table from '$lib/common/components/table.svelte';
	import type { Locale } from '$lib/common/types/types';
	import { onMount } from 'svelte';

	let tableData: string[][];

	let genresForMarket: undefined | Map<Locale, Map<string, number>> = undefined;
	onMount(async () => {
		const response = await fetch('/genres');
		const data: Map<Locale, Map<string, number>> = await response.json();

		genresForMarket = data;

		if (genresForMarket) {
			genresForMarket.forEach((genreMap) => {
				genreMap.forEach((amount, genre) => {
					tableData.push([genre, amount.toString()]);
				});
			});
		}
	});
</script>

{#if genresForMarket}
	{#each genresForMarket.entries() as genresForMarketEntry}
		<h3 class="mt-8 mb-4">{genresForMarketEntry[0].fullCountryName}</h3>

		<Table headers={['Genre', 'Amount of songs in top 50']} rows={tableData} />
		<div
			class="relative flex flex-col w-[500px] text-gray-700 bg-white shadow-md rounded-xl bg-clip-border"
		>
			<table class="w-full text-left table-auto min-w-max">
				<tbody>
					{#each genresForMarketEntry[1].entries() as entry}
						<tr>
							<td class="p-4">
								<p
									class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
								>
									{entry[0]}
								</p>
							</td>
							<td class="p-4">
								<p
									class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
								>
									{entry[1]}
								</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/each}
{:else}
	Nothing
{/if}
