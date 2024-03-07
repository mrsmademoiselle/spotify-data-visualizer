<script lang="ts">
	import Button from '$lib/common/components/button.svelte';
	import Table from '$lib/common/components/table.svelte';
	import {
		ButtonType,
		type GenreCount,
		type Locale,
		type SpotifyGenresForMarket
	} from '$lib/common/types/types';
	import { onMount } from 'svelte';
	import { PUBLIC_AUTO_FETCH_DATA } from '$env/static/public';
	import { tooltip } from '@svelte-plugins/tooltips';

	let genresForMarket: SpotifyGenresForMarket[] = [];
	let isLoading: boolean = false;

	onMount(() => {
		if (PUBLIC_AUTO_FETCH_DATA === 'true') {
			fetchData();
		}
	});

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
		const tableHeader = 'Genre,Occurrences (top 50),Country\n';
		const csvContent = genresForMarket
			.map((genreForMarket) => {
				const tableRows = genreForMarket.genres
					.map(
						(genreAmount) =>
							`${genreAmount.genre},${genreAmount.count},${genreForMarket.countryName}\n`
					)
					.join('');

				return tableRows;
			})
			.join('');

		const fullCSVContent = tableHeader + csvContent;

		const fileName = 'data.csv';

		const blob = new Blob([fullCSVContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function uploadData(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files && input.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				const csvContent = reader.result as string;
				const parsedData = parseCSV(csvContent);

				if (parsedData) {
					genresForMarket = parsedData;
				} else {
					console.error('Invalid CSV format');
				}
			};

			reader.readAsText(file);
		}
	}

	function parseCSV(csvContent: string): SpotifyGenresForMarket[] | null {
		try {
			const rows = csvContent.split('\n').map((row) => row.split(','));
			const groupedData: Record<string, SpotifyGenresForMarket> = {};
			const dataRows = rows.slice(1); // skip first row because theyre the headers

			dataRows.forEach((row) => {
				if (row.length === 3) {
					const locale = row[2].trim();
					const genre: GenreCount = { genre: row[0].trim(), count: parseInt(row[1].trim(), 10) };

					if (locale in groupedData) {
						groupedData[locale].genres.push(genre);
					} else {
						groupedData[locale] = { countryName: locale, genres: [genre] };
					}
				} else {
					console.error('Row does not have the expected number of elements:', row);
				}
			});

			const parsedData = Object.values(groupedData);

			return parsedData;
		} catch (error) {
			console.error('Error parsing CSV:', error);
			return null;
		}
	}
</script>

<div class="block m-12 h-[50px]">
	<div class="flex space-x-2">
		<Button on:click={fetchData} label="Fetch data" buttonType={ButtonType.OUTLINE} />

		<input type="file" accept=".csv" class="hidden" id="fileInput" on:change={uploadData} />
		<label
			use:tooltip={{
				action: 'hover',
				position: 'bottom',
				content:
					'The CSV file must contain the columns "Genre", "Occurrences" and "Country" in that order (naming does not matter).'
			}}
			for="fileInput"
			class="bg-transparent text-sky-700 hover:text-white hover:border-transparent text-center min-w-[180px] hover:bg-sky-700 cursor-pointer font-semibold py-2 px-4 border border-sky-700 hover:border-transparent rounded"
			><span class="uppercase">Upload CSV</span></label
		>

		{#if genresForMarket.length > 0}
			<Button
				on:click={downloadCSV}
				label="Download all data as CSV"
				buttonType={ButtonType.PRIMARY}
			/>
		{/if}
	</div>

	<div class="mt-8 border-b-2 py-4">
		<div class="font-bold text-xl pb-2">Description</div>
		Displays the different music genres contained in the top 50 Spotify playlist and how often they occur
		for each available Spotify market.
	</div>

	{#if isLoading}
		<div class="bg-white rounded-lg mt-4 animate-pulse">
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
			<div class="mt-8 text-gray-500 italic">No data yet. Please fetch or upload some.</div>
		{/if}
		{#each genresForMarket as genreForMarket}
			{@const tableData = getTableData(genreForMarket)}

			<h1 class="mt-8 mb-4 pb-4 border-b-2 border-black text-xl font-bold">
				{genreForMarket.countryName}
			</h1>
			<Table headers={['Genre', 'Occurrences (top 50)']} rows={tableData} />
		{/each}
	{/if}
</div>
