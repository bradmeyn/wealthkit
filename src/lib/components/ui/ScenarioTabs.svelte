<script lang="ts">
	import { Plus } from 'lucide-svelte';
	export let scenarioIds: number[];
	export let activeScenarioId = 1;
	export let maxScenarios = 2;
	export let onAdd;

	// Assuming $scenarios is a reactive store, you might need to use it directly or ensure it's passed correctly from the parent component
</script>

<div class="flex items-center mb-4">
	<div class="flex gap-3 p-2 text-sm border-ui-400">
		{#each scenarioIds as id}
			<button
				class={` ${activeScenarioId === id ? 'border-b-2 border-b-brand-default ' : 'text-ui-400'}`}
				on:click={() => (activeScenarioId = id)}
			>
				Scenario {id}
			</button>
		{/each}
		{#if scenarioIds.length > 1}
			<button
				class={` ${activeScenarioId === 0 ? 'border-b-2 border-b-brand-default ' : 'text-ui-400'}`}
				on:click={() => (activeScenarioId = 0)}
			>
				Compare
			</button>
		{/if}
	</div>
	{#if scenarioIds.length < maxScenarios}
		<button
			class="flex gap-1 p-1 items-center text-sm justify-center text-ui-400 hover:text-brand-default hover:bg-ui-700 rounded-full"
			on:click={onAdd}
		>
			<Plus class="size-4" />
		</button>
	{/if}
</div>
