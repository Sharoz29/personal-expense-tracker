export interface ExpenseType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeSource {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  expense_type_id: number;
  expense_type_name?: string;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: number;
  income_source_id: number;
  income_source_name?: string;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Savings {
  id: number;
  month: number;
  year: number;
  amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  expensesByType: { name: string; total: number }[];
  incomeBySource: { name: string; total: number }[];
}
