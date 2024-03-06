<script lang="ts">
	import Button from '$lib/common/components/button.svelte';
	import Table from '$lib/common/components/table.svelte';
	import { ButtonType, type SpotifyGenresForMarket } from '$lib/common/types/types';

	let genresForMarket: SpotifyGenresForMarket[] = [];
	let isLoading: boolean = false;

	async function fetchData() {
		isLoading = true;

		const response = await fetch('/genres');
		const data: SpotifyGenresForMarket[] = await response.json();

		genresForMarket = data;

		isLoading = false;
	}

	function getTableData(genreMarketMap: SpotifyGenresForMarket): string[][] {
		const tableData: string[][] = [];

		genreMarketMap.genres.forEach((genreAmount) => {
			tableData.push([genreAmount.genre, genreAmount.count.toString()]);
		});

		return tableData;
	}

	function downloadCSV() {
		const csvContent = genresForMarket
			.map((genreForMarket) => {
				const tableHeader = 'Genre,Amount of songs in top 50,Locale\n';

				const tableRows = genreForMarket.genres
					.map(
						(genreAmount) =>
							`${genreAmount.genre},${genreAmount.count},${genreForMarket.locale.fullCountryName}\n`
					)
					.join('');

				return tableHeader + tableRows;
			})
			.join('');

		const fileName = 'allGenresForMarket.csv';

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function uploadData(event: Event) {}
</script>

<div class="block m-12 h-[50px]">
	<div class="flex space-x-2">
		<Button on:click={fetchData} label="Fetch data" buttonType={ButtonType.OUTLINE} />

		<input type="file" accept=".csv" class="hidden" id="fileInput" on:change={uploadData} />
		<Button label="Upload data" buttonType={ButtonType.OUTLINE} />

		{#if true || genresForMarket.length > 0}
			<Button
				on:click={downloadCSV}
				label="Download all data as CSV"
				buttonType={ButtonType.PRIMARY}
			/>
		{/if}
	</div>

	{#if isLoading}
		<div class="bg-white rounded-lg mt-8 animate-pulse">
			<div class="w-2/3 h-8 bg-gray-300 rounded mb-8"></div>

			<div class="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
			<div class="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
			<div class="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
			<div class="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
			<div class="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
			<div class="w-1/3 h-8 bg-gray-300 rounded mb-2"></div>
		</div>
	{:else}
		{#if genresForMarket.length === 0}
			<div class="mt-8">No data. Please fetch or upload some.</div>
		{/if}
		{#each genresForMarket as genreForMarket}
			{@const tableData = getTableData(genreForMarket)}

			<h1 class="mt-8 mb-4 pb-4 border-b-2 border-black text-xl font-bold">
				{genreForMarket.locale.fullCountryName}
			</h1>
			<Table headers={['Genre', 'Amount of songs in top 50']} rows={tableData} />
		{/each}
	{/if}
</div>
