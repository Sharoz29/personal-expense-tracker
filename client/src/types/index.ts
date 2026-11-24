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
  installment_plan_id: number | null;
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
  incurred_date: string | null;
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
  registration_number: string | null;
  principal_amount: number;
  profit_rate: number;
  final_profit_rate: number | null;
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

export interface MutualFundCompany {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface MutualFund {
  id: number;
  name: string;
  company_id: number;
  company_name?: string;
  category: string;
  risk_level: string;
  front_end_load_value: number;
  front_end_load_type: "percentage" | "fixed";
  back_end_load_value: number;
  back_end_load_type: "percentage" | "fixed";
  other_fees_value: number;
  other_fees_type: "percentage" | "fixed";
  created_at: string;
  updated_at: string;
}

export interface MutualFundTransaction {
  id: number;
  fund_id: number;
  fund_name?: string;
  company_name?: string;
  account_id: number | null;
  account_name?: string;
  amount: number;
  nav_at_purchase: number;
  units_allocated: number;
  front_end_load_amount: number;
  back_end_load_amount: number;
  other_fees_amount: number;
  net_invested_amount: number;
  is_online: boolean;
  investment_date: string;
  portal_reflection_date: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Committee {
  id: number;
  name: string;
  total_members: number;
  contribution_per_month: number;
  my_month: number;
  start_date: string;
  account_id: number | null;
  account_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CommitteePayment {
  id: number;
  committee_id: number;
  month_number: number;
  amount: number;
  payment_date: string;
  account_id: number | null;
  account_name?: string;
  created_at: string;
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
  pendingPayablesTotal: number;
  payablesTotalForMonth: number;
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

// Account Balance Snapshots
export interface AccountSnapshotTrajectory {
  account_id: number;
  account_name: string;
  current_balance: number;
  snapshots: { month: number; year: number; balance: number }[];
}

// Health Reports Module
export interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthReportCategory {
  id: number;
  name: string;
  follow_up_months: number | null;
  created_at: string;
  updated_at: string;
  markers?: HealthMarker[];
}

export interface FollowUpDue {
  category_id: number;
  category_name: string;
  family_member_id: number;
  family_member_name: string;
  last_report_date: string;
  next_due_date: string;
  is_overdue: boolean;
}

export interface ReferenceRange {
  label: string;
  min?: number | null;
  max?: number | null;
  value?: string | null;
  color: "green" | "yellow" | "red";
}

export interface HealthMarker {
  id: number;
  name: string;
  unit: string;
  category_id: number;
  category_name?: string;
  marker_type: "numeric" | "text";
  min_reference: number | null;
  max_reference: number | null;
  normal_value: string | null;
  reference_ranges: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthReport {
  id: number;
  family_member_id: number;
  family_member_name?: string;
  category_id: number;
  category_name?: string;
  report_date: string;
  lab_name: string;
  notes: string;
  created_at: string;
  updated_at: string;
  results?: HealthReportResult[];
}

export interface HealthReportResult {
  id: number;
  report_id: number;
  marker_id: number;
  marker_name?: string;
  marker_unit?: string;
  marker_type?: "numeric" | "text";
  value: number | null;
  text_value: string | null;
  min_reference: number | null;
  max_reference: number | null;
  normal_value: string | null;
  reference_ranges: string | null;
  created_at: string;
}

export interface HealthMarkerHistory {
  report_id: number;
  report_date: string;
  lab_name: string;
  value: number | null;
  text_value: string | null;
  min_reference: number | null;
  max_reference: number | null;
  normal_value: string | null;
  reference_ranges: string | null;
  marker_type: "numeric" | "text";
}

// Learning Module Types
export interface Flashcard {
  id: number;
  french_text: string;
  english_meaning: string;
  audio_filename: string | null;
  audio_url: string | null;
  audio_key: string | null;
  category: string;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFlashcardDto {
  french_text: string;
  english_meaning: string;
  category?: string;
  difficulty_level?: string;
}

export interface FrenchTestResult {
  id: number;
  test_name: string;
  test_type: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number | null;
  completed_at: string;
}
