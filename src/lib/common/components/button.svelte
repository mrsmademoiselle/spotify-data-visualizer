<script lang="ts">
	import { ButtonType } from '../types/types';
	import { clsx } from 'clsx';

	export let label: string;
	export let buttonType: ButtonType = ButtonType.PRIMARY;
	export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
	{type}
	class={clsx(
		buttonType === ButtonType.PRIMARY && 'text-white bg-sky-700 hover:bg-sky-900',
		buttonType === ButtonType.OUTLINE &&
			'bg-transparent text-sky-700 hover:text-white hover:border-transparent',
		'uppercase min-w-[180px] hover:bg-sky-700 cursor-pointer font-semibold py-2 px-4 border border-sky-700 hover:border-transparent rounded'
	)}
	on:click>{label}</button
>
