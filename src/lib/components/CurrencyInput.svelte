<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';

	export let label = 'Label';
	export let value: number;
</script>

<Label class="space-y-1 mb-3">
	<span>{label}</span>
	<Input let:props class="rounded">
		<Icon icon="carbon:currency-dollar" slot="left" class="w-5 h-5 text-emerald-300" />
		<input type="number" {...props} bind:value />
	</Input>
</Label>
