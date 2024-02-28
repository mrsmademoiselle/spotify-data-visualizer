<script lang="ts">
	import type { Locale } from '../types/types';

	export let locale: Locale;
	export let genresForMarket: Map<string, number>;
</script>

<h3 class="mt-8 mb-4">{locale.fullCountryName}</h3>
<div
	class="relative flex flex-col w-[500px] text-gray-700 bg-white shadow-md rounded-xl bg-clip-border"
>
	<table class="w-full text-left table-auto min-w-max">
		<thead>
			<tr>
				<th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
					<p
						class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
					>
						Genre
					</p>
				</th>
				<th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
					<p
						class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
					>
						Amount of songs in top 50
					</p>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each genresForMarket.entries() as entry}
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
