<script lang="ts">
	interface MenuItem {
		href: string;
		label: string;
	}
	const menuItems: MenuItem[] = [
		{ href: '/', label: 'Home' },
		{ href: '/genres', label: 'Top songs genres' }
	];
</script>

<nav class="bg-gray-800 p-4">
	<div class="mx-8 flex justify-between">
		<a href="/" class="text-white text-lg font-semibold">Skeleton</a>

		<div class="flex justify-end space-x-8">
			{#each menuItems as menuItem}
				<a href={menuItem.href} class="text-white">{menuItem.label}</a>
			{/each}
		</div>
	</div>
</nav>
