<script lang="ts">
	import html2canvas from 'html2canvas';
	import Inputs from './Inputs.svelte';
	import GrowthChart from './GrowthChart.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Table from './Table.svelte';
	import { formatAsCurrency, formatAsPercentage } from '$lib/utils/formatters';
	import LegendList from '$lib/components/charts/LegendList.svelte';
	import { Download } from 'lucide-svelte';
	import type { GrowthResult, GrowthScenario } from '../calculator.svelte';

	interface Props {
		scenario: GrowthScenario;
		result: GrowthResult;
	}

	let { scenario = $bindable(), result }: Props = $props();
	let selectedView = $state('chart');
	let chartContainer: HTMLElement;

	async function downloadChart() {
		if (chartContainer) {
			const tabsElement = chartContainer.querySelector('[role="tablist"]');
			const downloadButton = chartContainer.querySelector('.download-button');
			if (tabsElement) tabsElement.classList.add('hidden');
			if (downloadButton) downloadButton.classList.add('hidden');

			const canvas = await html2canvas(chartContainer);
			const dataUrl = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = 'chart.png';
			link.href = dataUrl;
			link.click();

			if (tabsElement) tabsElement.classList.remove('hidden');
			if (downloadButton) downloadButton.classList.remove('hidden');
		}
	}

	function downloadCSV() {
		const headers = ['Year', 'Starting Value', 'Contributions', 'Interest', 'Ending Value'];
		const csvContent = [
			headers.join(','),
			...result.annualData.map((row) =>
				[
					row.year,
					row.startingValue,
					row.yearlyContribution,
					row.yearlyInterest,
					row.endingValue
				].join(',')
			)
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', 'table_data.csv');
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	function handleDownload() {
		if (selectedView === 'chart') {
			downloadChart();
		} else {
			downloadCSV();
		}
	}
</script>

<section class="flex flex-col lg:flex-row gap-8">
	<aside class="max-w-[1000px] min-w-[300px]">
		<Inputs bind:scenario />
	</aside>

	<div class="w-full space-y-6">
		<div class="grid grid-cols-3 gap-3">
			{@render dataCard('Principal', scenario.principal, formatAsCurrency)}
			{@render dataCard('Contributions', result.totalContributions, formatAsCurrency)}
			{@render dataCard('Interest', result.totalInterest, formatAsCurrency)}
		</div>

		<div class="card" bind:this={chartContainer}>
			<div class="flex flex-col md:flex-row gap-4 justify-between mb-3">
				<div>
					<p class=" text-muted">
						After {scenario.years} years at {formatAsPercentage(scenario.interestRate)} p.a
					</p>
					<p class="font-semibold text-2xl md:text-2xl">
						{formatAsCurrency(result.totalValue)}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<Tabs.Root
						value={selectedView}
						onValueChange={(value) => (selectedView = value)}
						class="w-[200px]"
					>
						<Tabs.List class="grid w-full grid-cols-2">
							<Tabs.Trigger value="chart">Chart</Tabs.Trigger>
							<Tabs.Trigger value="table">Table</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
					<button
						onclick={handleDownload}
						class="p-2 hover:bg-muted rounded transition-colors duration-200 download-button"
						title={'Download ' + (selectedView === 'chart' ? 'chart' : 'csv')}
					>
						<Download class="size-4" />
					</button>
				</div>
			</div>

			<Tabs.Root value={selectedView} class="mt-4">
				<Tabs.Content value="chart" class="m-0">
					<GrowthChart data={result.annualData} />
				</Tabs.Content>

				<Tabs.Content value="table" class="m-0">
					<Table annualData={result.annualData} />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</section>

{#snippet dataCard(label: string, value: number, formatter: (value: number) => string)}
	<div class="card col-span-3 md:col-span-2 lg:col-span-1">
		<p class="text-muted">{label}</p>
		<p class="text-lg md:text-xl font-semibold">
			{formatter(value)}
		</p>
	</div>
{/snippet}
