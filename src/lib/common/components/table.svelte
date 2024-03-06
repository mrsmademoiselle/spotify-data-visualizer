<script lang="ts">
	import { ButtonType } from '../types/types';
	import Button from './button.svelte';

	export let headers: string[];
	export let rows: string[][];

	const itemsPerPage = 5;
	let currentPage = 1;

	const totalPages = Math.ceil(rows.length / itemsPerPage);
	$: visibleRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}
</script>

<div class="relative flex flex-col w-[500px] text-gray-700 bg-white shadow-md rounded-xl">
	<table class="w-full text-left">
		<thead>
			<tr>
				{#each headers as header}
					<th class="p-4 border border-blue-gray-100">
						<p class="block font-sans text-lg leading-none text-blue-gray-900">
							{header}
						</p>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each visibleRows as row}
				<tr>
					{#each row as column}
						<td class="p-4 border">
							<p class="block text-sm">
								{column}
							</p>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex justify-between items-center m-4">
		<Button on:click={prevPage} buttonType={ButtonType.OUTLINE} label="Previous" />
		<p>Page {currentPage} of {totalPages}</p>
		<Button on:click={nextPage} buttonType={ButtonType.OUTLINE} label="Next" />
	</div>
</div>
