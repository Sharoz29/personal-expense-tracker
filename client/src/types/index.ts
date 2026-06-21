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

export interface Account {
  id: number;
  name: string;
  account_number: string;
  balance: number;
  track_installments: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountTransfer {
  id: number;
  from_account_id: number;
  from_account_name?: string;
  to_account_id: number;
  to_account_name?: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseBreakdown {
  label: string;
  amount: number;
}

export interface Expense {
  id: number;
  expense_type_id: number;
  expense_type_name?: string;
  account_id: number;
  account_name?: string;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  breakdowns: ExpenseBreakdown[] | null;
  loan_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: number;
  income_source_id: number;
  income_source_name?: string;
  account_id: number;
  account_name?: string;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  installment_plan_id: number | null;
  reference_number: string;
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

export interface PayableType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Payee {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Payable {
  id: number;
  description: string;
  amount: number;
  amount_paid: number;
  from_person: string;
  payee_id: number | null;
  payee_name?: string;
  status: "pending" | "paid";
  due_date: string | null;
  paid_date: string | null;
  account_id: number | null;
  account_name?: string;
  income_id: number | null;
  payable_type_id: number | null;
  payable_type_name?: string;
  created_at: string;
  updated_at: string;
}

export interface InstallmentPlan {
  id: number;
  name: string;
  total_amount: number;
  buyer_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: number;
  name: string;
  total_amount: number;
  description: string;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: number;
  name: string;
  asset_type_id: number;
  asset_type_name?: string;
  current_value: number;
  weight_tolas: number | null;
  account_id: number | null;
  account_name?: string;
  created_at: string;
  updated_at: string;
}

export interface SavingsCertificate {
  id: number;
  certificate_type: string;
  principal_amount: number;
  profit_rate: number;
  purchase_date: string;
  maturity_date: string;
  duration: string;
  tax_rate: number;
  profit_tracking_start_date: string | null;
  account_id: number | null;
  account_name?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlySavingsRecord {
  month: number;
  year: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  cumulativeSavings: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  expensesByType: { name: string; total: number }[];
  incomeBySource: { name: string; total: number }[];
}

export interface AnnualSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  expensesByType: { name: string; total: number }[];
  incomesBySource: { name: string; total: number }[];
  monthlyBreakdown: { month: number; income: number; expenses: number }[];
}
