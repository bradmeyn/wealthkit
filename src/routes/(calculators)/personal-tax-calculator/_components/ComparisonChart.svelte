<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Legend,
		Tooltip
	} from 'chart.js';
	import { COLOURFUL, MONOCHROME } from '$lib/constants/colours';
	import colors from 'tailwindcss/colors';

	type Result = {
		id: number;
		taxableIncome: number;
		incomeTax: number;
		lowIncomeOffset: number;
		helpRepayment: number;
		medicareLevy: number;
		medicareLevySurcharge: number;
		totalTax: number;
	};

	// props
	export let results: Result[];
	export let formatter: (value: number) => string;
	export let theme: 'monochrome' | 'colourful' = 'monochrome';

	const colours = theme === 'monochrome' ? MONOCHROME : COLOURFUL;
	let chartId: HTMLCanvasElement;
	let chart: Chart;

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

	const taxComponents = [
		'incomeTax',
		'lowIncomeOffset',
		'helpRepayment',
		'medicareLevy',
		'medicareLevySurcharge'
	] as const;

	function prepareChartData(results: Result[]) {
		return taxComponents.map((component, index) => ({
			label: component,
			data: results.map((result) => result[component]),
			backgroundColor: colours[index % colours.length],
			borderWidth: 0,
			borderRadius: 5,
			barThickness: 80
		}));
	}

	onMount(() => {
		chart = new Chart(chartId, {
			type: 'bar',
			data: {
				labels: results.map((result) => `Scenario ${result.id}`),
				datasets: prepareChartData(results)
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					x: {
						stacked: true,
						grid: { display: false },
						title: {
							font: { size: 16, family: 'sans-serif' },
							color: colors.slate[100]
						},
						ticks: {
							font: { size: 16, family: 'sans-serif' },
							color: '#ffffff'
						}
					},
					y: {
						stacked: true,
						beginAtZero: true,
						grid: {
							display: true,
							color: colors.slate[600]
						},
						ticks: {
							callback: (value) => formatter(+value),
							font: { size: 16, family: 'sans-serif' },
							color: colors.slate[100]
						}
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							title: (context) => context[0].dataset.label,
							label: (context) => formatter(context.parsed.y)
						},
						boxPadding: 5
					},
					legend: { display: false }
				}
			}
		});
	});

	$: if (chart) {
		chart.data.labels = results.map((result) => `Scenario ${result.id}`);
		chart.data.datasets = prepareChartData(results);
		chart.update();
	}
</script>

<div class="min-h-[400px] relative">
	<canvas class="w-full absolute min-h-full p-1" bind:this={chartId} />
</div>
