<script lang="ts">
	import { results, scenarios } from '../store';
	import ComparisonChart from './ComparisonChart.svelte';
	import { formatAsCurrency, formatAsPercentage } from '$lib/utils/formatters';
	import { COLOURFUL } from '$lib/constants/colours';
</script>

<section class="flex flex-col-reverse lg:flex-row gap-8">
	<div class="card h-fit">
		<div class="overflow-x-auto">
			<h2>Comparison</h2>
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<th class="p-2 text-ui-300 text-sm">Scenario</th>
						{#each $results as result, i}
							<th class="p-2 text-left">
								<div class="flex items-center gap-2">
									<div class="size-3 rounded-full" style="background-color: {COLOURFUL[i]}" />
									<div class="text-white text-nowrap text-base">Scenario {result.id}</div>
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="p-2 text-ui-300 text-sm">Principle</td>
						{#each $results as result, i}
							<td class="p-2 text-nowrap">{formatAsCurrency(result.annualData[0].startingValue)}</td
							>
						{/each}
					</tr>
					<tr>
						<td class="p-2 text-ui-300 text-sm">Contributions (p.a.)</td>
						{#each $results as result, i}
							<td class="p-2 text-nowrap"
								>{formatAsCurrency(result.annualData[0].yearlyContribution)} p.a.</td
							>
						{/each}
					</tr>
					<tr>
						<td class="p-2 text-ui-300 text-sm">Interest (p.a.)</td>
						{#each $results as result, i}
							<td class="p-2">{formatAsPercentage($scenarios[i].interestRate)}</td>
						{/each}
					</tr>
					<tr>
						<td class="p-2 text-ui-300 text-sm">Years</td>
						{#each $results as result, i}
							<td class="p-2">{result.annualData.length} years</td>
						{/each}
					</tr>
					<tr>
						<td class="p-2 text-ui-300 text-sm">End Value</td>
						{#each $results as result, i}
							<td class="p-2 font-semibold text-white">{formatAsCurrency(result.totalValue)}</td>
						{/each}
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div class="w-full card">
		<h2>Total value</h2>
		<div class="flex items-center gap-6">
			{#each $results as result, i}
				<div class="flex justify-between mb-3">
					<div class="flex items-center gap-2">
						<div class="size-3 md:size-4 rounded-full" style="background-color: {COLOURFUL[i]}" />
						<p class="font-semibold text-xl md:text-2xl">
							{formatAsCurrency(result.totalValue, false)}
						</p>
					</div>
				</div>
			{/each}
		</div>
		<div>
			<!-- <Legend class="flex justify-center" {labels} theme={'colourful'} /> -->
			<ComparisonChart formatter={formatAsCurrency} theme={'colourful'} results={$results} />
		</div>
	</div>
</section>
