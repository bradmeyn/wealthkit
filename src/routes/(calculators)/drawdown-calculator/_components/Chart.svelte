<script lang="ts">
	import * as colors from 'tailwindcss/colors';
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Legend,
		Tooltip,
		Filler
	} from 'chart.js';
	import { formatAsCurrency } from '$lib/utils/formatters';
	import type { AnnualData } from '../types';
	import { COLOURFUL, MONOCHROME } from '$lib/constants/colours';

	// props
	export let data: AnnualData[] = [];

	$: years = data.map((item) => item.year);
	$: annualDrawdown = data.map((item) => item.withdrawal);

	let chartId: HTMLCanvasElement;
	let chart: Chart;

	// Register the required components
	Chart.register(
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Legend,
		Tooltip,
		Filler
	);

	onMount(() => {
		chart = new Chart(chartId, {
			type: 'line',
			data: {
				labels: years,
				datasets: [
					{
						label: 'Balance',
						data: data.map((i) => i.endingBalance),
						borderColor: COLOURFUL[0],
						backgroundColor: COLOURFUL[0] + '40',
						fill: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 4,
						pointBackgroundColor: COLOURFUL[0]
					},
					{
						label: 'Drawdown',
						data: data.map((i) => i.withdrawal),
						borderColor: MONOCHROME[1],
						backgroundColor: MONOCHROME[1] + '40',
						fill: true,
						borderWidth: 2,
						pointRadius: 0,
						pointHoverRadius: 4,
						pointBackgroundColor: MONOCHROME[1]
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					x: {
						grid: {
							display: false
						},
						title: {
							display: true,
							text: 'Year',
							font: {
								size: 16,
								family: 'sans-serif'
							},
							color: colors.slate[200]
						},
						ticks: {
							font: {
								size: 14,
								family: 'sans-serif'
							},
							color: colors.slate[200]
						}
					},
					y: {
						type: 'linear',
						display: true,
						position: 'left',
						grid: {
							display: true,
							color: colors.slate[600]
						},
						beginAtZero: true,
						ticks: {
							callback: (value) => formatAsCurrency(+value, false),
							font: {
								size: 14,
								family: 'sans-serif'
							},
							color: colors.slate[200]
						},
						title: {
							display: true,
							text: 'Balance',
							font: {
								size: 16,
								family: 'sans-serif'
							},
							color: colors.slate[200]
						}
					}
				},
				plugins: {
					tooltip: {
						enabled: true,
						mode: 'index',
						intersect: false,
						callbacks: {
							title: (tooltip) => `Year ${tooltip[0].label}`,
							label: (context) => {
								const label = context.dataset.label || '';
								const value = context.parsed.y || 0;
								return `${label}: ${formatAsCurrency(value, false)}`;
							}
						}
					},
					legend: {
						display: false
					}
				}
			}
		});
	});

	$: if (chart) {
		chart.data.labels = years;
		chart.data.datasets[0].data = data.map((item) => item.endingBalance);
		chart.data.datasets[1].data = data.map((i) => i.withdrawal);

		chart.update();
	}
</script>

<div class="min-h-[400px] lg:min-h-[500px] relative">
	<canvas class="w-full absolute min-h-full p-1" bind:this={chartId} />
</div>
