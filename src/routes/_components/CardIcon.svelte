<script lang="ts">
	import barChart from '$lib/assets/bar-chart.svg';
	import pieChart from '$lib/assets/pie-chart.svg';
	import lineChart from '$lib/assets/line-chart.svg';
	import taxCalculator from '$lib/assets/tax-calculator.svg';

	export let name: string;

	const iconMap = {
		'Growth Calculator': lineChart,
		Budget: pieChart,
		'Portfolio Builder': barChart,
		'Personal Tax Calculator': taxCalculator
	} as const;

	type IconName = keyof typeof iconMap;

	$: src = iconMap[name as IconName] || '';
</script>

<div class="p-2 text-xl size-10 bg-slate-900 rounded border border-slate-600">
	<img class="w-10" {src} alt={`${name} logo`} />
</div>
