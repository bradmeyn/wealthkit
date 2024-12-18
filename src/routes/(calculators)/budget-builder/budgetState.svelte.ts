import { FREQUENCIES, type FrequencyType } from '$lib/constants/frequencies';
import { v4 as uuidv4 } from 'uuid';
import { setContext, getContext } from 'svelte';

export type BudgetItem = {
	id: string;
	name: string;
	amount: number;
	category: string;
	frequency: FrequencyType;
	type: 'Income' | 'Expense' | 'Savings';
};

export function convertToFrequency(
	amount: number,
	fromFrequency: FrequencyType,
	toFrequency: FrequencyType
) {
	const annualAmount = amount * FREQUENCIES[fromFrequency].value;
	return annualAmount / FREQUENCIES[toFrequency].value;
}

export function calculateCategoryTotal(
	items: BudgetItem[],
	category: string,
	toFrequency: FrequencyType
): number {
	const annualTotal = items
		.filter((item) => item.category === category)
		.reduce((acc, item) => acc + item.amount * FREQUENCIES[item.frequency].value, 0);

	return convertToFrequency(annualTotal, 'annually', toFrequency);
}

export function createBudgetState() {
	let frequency = $state<FrequencyType>('monthly');

	const budgetItems = $state<BudgetItem[]>([
		{
			id: uuidv4(),
			name: 'Salary',
			amount: 1000,
			category: 'Wages & Salary',
			frequency: 'monthly',
			type: 'Income'
		},
		{
			id: uuidv4(),
			name: 'Bonus',
			amount: 500,
			category: 'Wages & Salary',
			frequency: 'annually',
			type: 'Income'
		},
		{
			id: uuidv4(),
			name: 'Rental Income',
			amount: 500,
			category: 'Investments',
			frequency: 'annually',
			type: 'Income'
		},
		{
			id: uuidv4(),
			name: 'Interest',
			amount: 500,
			category: 'Investments',
			frequency: 'annually',
			type: 'Income'
		},
		{
			id: uuidv4(),
			name: 'Dividends & Distributions',
			amount: 500,
			category: 'Investments',
			frequency: 'quarterly',
			type: 'Income'
		},
		{
			id: uuidv4(),
			name: 'Capital Gains',
			amount: 500,
			category: 'Investments',
			frequency: 'annually',
			type: 'Income'
		},
		{
			id: uuidv4(),
			name: 'Rent/Mortgage',
			amount: 100,
			category: 'Housing & Utilities',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Rates',
			amount: 300,
			category: 'Housing & Utilities',
			frequency: 'quarterly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Water',
			amount: 100,
			category: 'Housing & Utilities',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Electricity & Gas',
			amount: 300,
			category: 'Housing & Utilities',
			frequency: 'quarterly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Internet & Phone',
			amount: 120,
			category: 'Housing & Utilities',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Groceries',
			amount: 50,
			category: 'Food',
			frequency: 'weekly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Takeaway',
			amount: 50,
			category: 'Food',
			frequency: 'weekly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Gym Membership',
			amount: 30,
			category: 'Health',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Fuel',
			amount: 50,
			category: 'Car',
			frequency: 'weekly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Registration',
			amount: 50,
			category: 'Car',
			frequency: 'weekly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Insurance',
			amount: 1200,
			category: 'Car',
			frequency: 'annually',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Maintenance',
			amount: 200,
			category: 'Car',
			frequency: 'annually',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Streaming Services',
			amount: 10,
			category: 'Entertainment & Leisure',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Hobbies',
			amount: 10,
			category: 'Entertainment & Leisure',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Eating Out',
			amount: 10,
			category: 'Entertainment & Leisure',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Alcohol',
			amount: 10,
			category: 'Entertainment & Leisure',
			frequency: 'monthly',
			type: 'Expense'
		},
		{
			id: uuidv4(),
			name: 'Vacation Fund',
			amount: 50,
			category: 'Cash Savings',
			frequency: 'annually',
			type: 'Savings'
		},
		{
			id: uuidv4(),
			name: 'Retirement Fund',
			amount: 200,
			category: 'Superannuation',
			frequency: 'monthly',
			type: 'Savings'
		},
		{
			id: uuidv4(),
			name: 'ETF Portfolio',
			amount: 200,
			category: 'Investments',
			frequency: 'monthly',
			type: 'Savings'
		}
	]);

	// Items by type
	const income = $derived<BudgetItem[]>(budgetItems.filter((i) => i.type === 'Income'));
	const expenses = $derived<BudgetItem[]>(budgetItems.filter((i) => i.type === 'Expense'));
	const savings = $derived<BudgetItem[]>(budgetItems.filter((i) => i.type === 'Savings'));

	// Categories
	const incomeCategories = $state<string[]>([...new Set(income.map((i) => i.category))]);
	const expenseCategories = $state<string[]>([...new Set(expenses.map((i) => i.category))]);
	const savingsCategories = $state<string[]>([...new Set(savings.map((i) => i.category))]);

	// Frequency-adjusted items
	const adjustedIncome = $derived<BudgetItem[]>(
		income.map((item) => ({
			...item,
			amount: convertToFrequency(item.amount, item.frequency, frequency)
		}))
	);

	const adjustedExpenses = $derived<BudgetItem[]>(
		expenses.map((item) => ({
			...item,
			amount: convertToFrequency(item.amount, item.frequency, frequency)
		}))
	);

	const adjustedSavings = $derived<BudgetItem[]>(
		savings.map((item) => ({
			...item,
			amount: convertToFrequency(item.amount, item.frequency, frequency)
		}))
	);

	const expenseByCategory = $derived<{ category: string; total: number }[]>(
		expenseCategories.map((category) => {
			const categoryExpenses = adjustedExpenses.filter((i) => i.category === category);
			const total = categoryExpenses.reduce((acc, i) => acc + i.amount, 0);
			return { category, total };
		})
	);

	// Calculate totals for current frequency
	const totalIncome = $derived<number>(adjustedIncome.reduce((acc, i) => acc + i.amount, 0));
	const totalExpenses = $derived<number>(adjustedExpenses.reduce((acc, i) => acc + i.amount, 0));
	const totalSavings = $derived<number>(adjustedSavings.reduce((acc, i) => acc + i.amount, 0));
	const unallocated = $derived<number>(totalIncome - totalExpenses - totalSavings);

	function addItem(item: BudgetItem) {
		budgetItems.push(item);
	}

	function removeItem(id: string) {
		const index = budgetItems.findIndex((i) => i.id === id);
		if (index !== -1) {
			budgetItems.splice(index, 1);
		}
	}

	function updateItem(item: BudgetItem) {
		const index = budgetItems.findIndex((i) => i.id === item.id);
		if (index !== -1) {
			budgetItems[index] = item;
		}
	}

	return {
		get frequency() {
			return frequency;
		},
		set frequency(value: FrequencyType) {
			frequency = value;
		},

		get budgetItems() {
			return budgetItems;
		},

		get income() {
			return income;
		},

		get expenses() {
			return expenses;
		},

		get savings() {
			return savings;
		},

		get incomeCategories() {
			return incomeCategories;
		},
		get expenseCategories() {
			return expenseCategories;
		},
		get savingsCategories() {
			return savingsCategories;
		},
		get expenseByCategory() {
			return expenseByCategory;
		},

		// Totals
		get totalIncome() {
			return totalIncome;
		},
		get totalExpenses() {
			return totalExpenses;
		},
		get totalSavings() {
			return totalSavings;
		},

		get unallocated() {
			return unallocated;
		},

		addItem,
		removeItem,
		updateItem
	};
}

const BUDGET_KEY = Symbol('budget');

export function setBudgetState() {
	return setContext(BUDGET_KEY, createBudgetState());
}

export function getBudgetState() {
	return getContext<ReturnType<typeof createBudgetState>>(BUDGET_KEY);
}

export function downloadCsv(budgetItems: BudgetItem[]) {
	// Sort items by type
	const income = budgetItems.filter((item) => item.type === 'Income');
	const expenses = budgetItems.filter((item) => item.type === 'Expense');
	const savings = budgetItems.filter((item) => item.type === 'Savings');

	// Create CSV header
	const csvRows = ['Type,Name,Category,Amount,Frequency,Monthly Total,Annual Total'];

	// Helper function to add items of a specific type
	function addItemsToCSV(items: BudgetItem[], type: string) {
		if (items.length > 0) {
			csvRows.push(`${type}`); // Add type header

			items.forEach((item) => {
				const monthlyAmount = convertToFrequency(item.amount, item.frequency, 'monthly');
				const annualAmount = convertToFrequency(item.amount, item.frequency, 'annually');

				csvRows.push(
					`,"${item.name}","${item.category}",${item.amount},${item.frequency},${monthlyAmount.toFixed(2)},${annualAmount.toFixed(2)}`
				);
			});

			// Add total for this type
			const monthlyTotal = items.reduce(
				(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'monthly'),
				0
			);
			const annualTotal = items.reduce(
				(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'annually'),
				0
			);
			csvRows.push(`${type} Total,,,,${monthlyTotal.toFixed(2)},${annualTotal.toFixed(2)}`);
			csvRows.push(''); // Add empty line between sections
		}
	}

	// Add all item types
	addItemsToCSV(income, 'Income');
	addItemsToCSV(expenses, 'Expenses');
	addItemsToCSV(savings, 'Savings');

	// Calculate unallocated funds (income - (expenses + savings))
	const monthlyIncome = income.reduce(
		(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'monthly'),
		0
	);
	const monthlyExpenses = expenses.reduce(
		(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'monthly'),
		0
	);
	const monthlySavings = savings.reduce(
		(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'monthly'),
		0
	);
	const monthlyUnallocated = monthlyIncome - (monthlyExpenses + monthlySavings);

	const annualIncome = income.reduce(
		(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'annually'),
		0
	);
	const annualExpenses = expenses.reduce(
		(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'annually'),
		0
	);
	const annualSavings = savings.reduce(
		(acc, item) => acc + convertToFrequency(item.amount, item.frequency, 'annually'),
		0
	);
	const annualUnallocated = annualIncome - (annualExpenses + annualSavings);

	csvRows.push(`Unallocated,,,,${monthlyUnallocated.toFixed(2)},${annualUnallocated.toFixed(2)}`);

	// Create the CSV content
	const csvContent = csvRows.join('\n');

	// Create and trigger download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.setAttribute('href', url);
	const date = new Date().toLocaleDateString('en-AU').split('/').join('-');
	link.setAttribute('download', `budget-${date}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
