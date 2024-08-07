<script lang="ts">
	import Inputs from './Inputs.svelte';
	import Chart from './Chart.svelte';
	import ViewToggle from '$lib/components/ui/Tabs.svelte';
	import Table from './Table.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { formatAsCurrency } from '$lib/utils/formatters';
	import type { Result, Scenario } from '../types';
	import LegendList from '$lib/components/charts/LegendList.svelte';

	export let scenario: Scenario;
	export let result: Result;

	let options = [
		{ label: 'Chart', value: 'chart' },
		{ label: 'Table', value: 'table' }
	];
	let selectedView = 'chart';
</script>

<section class="flex flex-col lg:flex-row gap-8">
	<aside class="max-w-[1000px] min-w-[300px]">
		<Inputs
			bind:principal={scenario.principal}
			bind:contributionAmount={scenario.contributionAmount}
			bind:interestRate={scenario.interestRate}
			bind:contributionFrequency={scenario.contributionFrequency}
			bind:years={scenario.years}
		/>
	</aside>
	<Card class="w-full">
		<div class="w-full">
			<div class="flex flex-col md:flex-row gap-4 justify-between mb-3">
				<div>
					<p class="text-sm font-semibold text-brand-light">Total Value</p>
					<p class="font-semibold text-2xl md:text-2xl">
						{formatAsCurrency(result.totalValue, false)}
					</p>
				</div>
				<ViewToggle {options} bind:selectedView />
			</div>
			{#if selectedView === 'chart'}
				<Chart data={result.annualData} />
				<div class="md:max-w-xs">
					<p class="text-sm font-semibold text-brand-light">After {scenario.years} years</p>
					<LegendList
						formatter={formatAsCurrency}
						data={[
							{ label: 'Principle', value: result.annualData[0].startingValue },
							{ label: 'Contributions', value: result.totalContributions },
							{ label: 'Interest', value: result.totalInterest }
						]}
					/>
				</div>
			{:else if selectedView === 'table'}
				<Table annualData={result.annualData} />
			{/if}
		</div>
	</Card>
</section>
