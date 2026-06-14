// ---- Entities ----

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

// ---- DTOs ----

export interface CreateExpenseDto {
  expense_type_id: number;
  account_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  breakdowns?: ExpenseBreakdown[] | null;
  loan_id?: number | null;
}

export type UpdateExpenseDto = CreateExpenseDto;

export interface CreateIncomeDto {
  income_source_id: number;
  account_id: number;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  installment_plan_id?: number | null;
  reference_number?: string;
}

export type UpdateIncomeDto = CreateIncomeDto;

export interface CreateExpenseTypeDto {
  name: string;
}

export type UpdateExpenseTypeDto = CreateExpenseTypeDto;

export interface CreateIncomeSourceDto {
  name: string;
}

export type UpdateIncomeSourceDto = CreateIncomeSourceDto;

export interface CreateAccountDto {
  name: string;
  account_number: string;
  balance: number;
}

export interface UpdateAccountDto {
  name: string;
  account_number: string;
  track_installments?: boolean;
}

export interface CreateAccountTransferDto {
  from_account_id: number;
  to_account_id: number;
  amount: number;
  description: string;
  date: string;
}

export interface CreatePayableTypeDto {
  name: string;
}

export type UpdatePayableTypeDto = CreatePayableTypeDto;

export interface CreatePayeeDto {
  name: string;
}

export type UpdatePayeeDto = CreatePayeeDto;

export interface CreatePayableDto {
  description: string;
  amount: number;
  from_person?: string;
  payee_id?: number;
  due_date?: string;
  payable_type_id?: number;
  status?: "pending" | "paid";
  account_id?: number;
  paid_date?: string;
}

export type UpdatePayableDto = CreatePayableDto;

export interface CreateInstallmentPlanDto {
  name: string;
  total_amount: number;
  buyer_name: string;
  description?: string;
}

export type UpdateInstallmentPlanDto = CreateInstallmentPlanDto;

export interface CreateLoanDto {
  name: string;
  total_amount: number;
  description?: string;
  start_date?: string;
}

export type UpdateLoanDto = CreateLoanDto;

export interface CreateAssetTypeDto {
  name: string;
}

export type UpdateAssetTypeDto = CreateAssetTypeDto;

export interface CreateAssetDto {
  name: string;
  asset_type_id: number;
  current_value: number;
  account_id?: number;
}

export type UpdateAssetDto = CreateAssetDto;

export interface CreateSavingsCertificateDto {
  certificate_type: string;
  principal_amount: number;
  profit_rate: number;
  purchase_date: string;
  maturity_date: string;
  duration: string;
  tax_rate: number;
  profit_tracking_start_date?: string;
  account_id?: number;
}

export type UpdateSavingsCertificateDto = CreateSavingsCertificateDto;

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
