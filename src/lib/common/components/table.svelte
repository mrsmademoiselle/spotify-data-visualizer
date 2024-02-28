<script lang="ts">
	export let headers: string[];
	export let rows: string[][];
</script>

<div
	class="relative flex flex-col w-[500px] text-gray-700 bg-white shadow-md rounded-xl bg-clip-border"
>
	<table class="w-full text-left table-auto min-w-max">
		<thead>
			<tr>
				{#each headers as header}
					<th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
						<p
							class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
						>
							{header}
						</p>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				<tr>
					{#each row as column}
						<td class="p-4">
							<p
								class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
							>
								{column}
							</p>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
