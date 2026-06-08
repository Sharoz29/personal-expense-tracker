import { useState, useCallback } from "react";
import { useLoans } from "../hooks/useLoans";
import { useAccounts } from "../hooks/useAccounts";
import { useExpenseTypes } from "../hooks/useExpenseTypes";
import { expensesApi } from "../api/expenses.api";
import LoanForm from "../components/loans/LoanForm";
import LoanPaymentForm from "../components/loans/LoanPaymentForm";
import LoanPaymentList from "../components/loans/LoanPaymentList";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { Loan, Expense } from "../types";
import { formatPKR } from "../utils/format";

const LOAN_PAYMENT_TYPE = "Loan Payment";

export default function Loans() {
  const { loans, loading, create, update, remove, getPayments } = useLoans();
  const { accounts } = useAccounts();
  const { expenseTypes } = useExpenseTypes();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [deletingLoan, setDeletingLoan] = useState<Loan | null>(null);

  // Per-loan expanded state and payments
  const [expandedLoanId, setExpandedLoanId] = useState<number | null>(null);
  const [loanPayments, setLoanPayments] = useState<Record<number, Expense[]>>({});
  const [paymentsLoading, setPaymentsLoading] = useState<number | null>(null);

  // Payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentLoanId, setPaymentLoanId] = useState<number | null>(null);
  const [editingPayment, setEditingPayment] = useState<Expense | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Expense | null>(null);

  const loanPaymentTypeId = expenseTypes.find((t) => t.name === LOAN_PAYMENT_TYPE)?.id;

  const fetchPayments = useCallback(async (loanId: number) => {
    setPaymentsLoading(loanId);
    try {
      const payments = await getPayments(loanId);
      setLoanPayments((prev) => ({ ...prev, [loanId]: payments }));
    } catch {
      // silently fail
    } finally {
      setPaymentsLoading(null);
    }
  }, [getPayments]);

  const toggleLoan = (loanId: number) => {
    if (expandedLoanId === loanId) {
      setExpandedLoanId(null);
    } else {
      setExpandedLoanId(loanId);
      if (!loanPayments[loanId]) {
        fetchPayments(loanId);
      }
    }
  };

  const handleCreateLoan = async (data: Parameters<typeof create>[0]) => {
    await create(data);
    setShowLoanForm(false);
  };

  const handleUpdateLoan = async (data: Parameters<typeof update>[1]) => {
    if (!editingLoan) return;
    await update(editingLoan.id, data);
    setEditingLoan(null);
    setShowLoanForm(false);
  };

  const handleDeleteLoan = async () => {
    if (!deletingLoan) return;
    try {
      await remove(deletingLoan.id);
      setDeletingLoan(null);
    } catch (err: any) {
      // Error handled by hook
    }
  };

  const handleCreatePayment = async (data: {
    account_id: number;
    amount: number;
    description: string;
    date: string;
    month: number;
    year: number;
  }) => {
    if (!paymentLoanId || !loanPaymentTypeId) return;
    await expensesApi.create({
      ...data,
      expense_type_id: loanPaymentTypeId,
      loan_id: paymentLoanId,
    });
    setShowPaymentForm(false);
    setPaymentLoanId(null);
    await fetchPayments(paymentLoanId);
  };

  const handleUpdatePayment = async (data: {
    account_id: number;
    amount: number;
    description: string;
    date: string;
    month: number;
    year: number;
  }) => {
    if (!editingPayment || !loanPaymentTypeId) return;
    await expensesApi.update(editingPayment.id, {
      ...data,
      expense_type_id: loanPaymentTypeId,
      loan_id: editingPayment.loan_id ?? undefined,
    });
    setEditingPayment(null);
    setShowPaymentForm(false);
    if (editingPayment.loan_id) {
      await fetchPayments(editingPayment.loan_id);
    }
  };

  const handleDeletePayment = async () => {
    if (!deletingPayment) return;
    const loanId = deletingPayment.loan_id;
    await expensesApi.delete(deletingPayment.id);
    setDeletingPayment(null);
    if (loanId) {
      await fetchPayments(loanId);
    }
  };

  const getLoanPaidTotal = (loanId: number) => {
    const payments = loanPayments[loanId];
    if (!payments) return 0;
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Loans</h2>
        <button
          onClick={() => { setEditingLoan(null); setShowLoanForm(true); }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add Loan
        </button>
      </header>
      <div className="p-4 md:p-6 space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : loans.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No loans yet. Click "Add Loan" to get started.</div>
        ) : (
          loans.map((loan) => {
            const isExpanded = expandedLoanId === loan.id;
            const payments = loanPayments[loan.id] ?? [];
            const paidTotal = getLoanPaidTotal(loan.id);
            const remaining = loan.total_amount - paidTotal;
            const progress = loan.total_amount > 0 ? (paidTotal / loan.total_amount) * 100 : 0;

            return (
              <div key={loan.id} className="bg-white rounded-xl border border-gray-200">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleLoan(loan.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 truncate">{loan.name}</h3>
                      {loan.description && (
                        <span className="text-xs text-gray-500 hidden sm:inline">({loan.description})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Total: {formatPKR(loan.total_amount)}</span>
                      {loanPayments[loan.id] && (
                        <>
                          <span>Paid: {formatPKR(paidTotal)}</span>
                          <span className={remaining > 0 ? "text-red-600" : "text-green-600"}>
                            {remaining > 0 ? `Remaining: ${formatPKR(remaining)}` : "Fully Paid"}
                          </span>
                        </>
                      )}
                    </div>
                    {loanPayments[loan.id] && loan.total_amount > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full transition-all ${progress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaymentLoanId(loan.id);
                        setEditingPayment(null);
                        setShowPaymentForm(true);
                      }}
                      className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Payment
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingLoan(loan); setShowLoanForm(true); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletingLoan(loan); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {paymentsLoading === loan.id ? (
                      <div className="p-4 text-gray-500 text-sm">Loading payments...</div>
                    ) : (
                      <LoanPaymentList
                        payments={payments}
                        total={paidTotal}
                        onEdit={(p) => {
                          setEditingPayment(p);
                          setPaymentLoanId(loan.id);
                          setShowPaymentForm(true);
                        }}
                        onDelete={setDeletingPayment}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Loan Form Modal */}
      <Modal
        open={showLoanForm}
        onClose={() => { setShowLoanForm(false); setEditingLoan(null); }}
        title={editingLoan ? "Edit Loan" : "Add Loan"}
      >
        <LoanForm
          loan={editingLoan}
          onSubmit={editingLoan ? handleUpdateLoan : handleCreateLoan}
          onCancel={() => { setShowLoanForm(false); setEditingLoan(null); }}
        />
      </Modal>

      {/* Payment Form Modal */}
      <Modal
        open={showPaymentForm}
        onClose={() => { setShowPaymentForm(false); setEditingPayment(null); setPaymentLoanId(null); }}
        title={editingPayment ? "Edit Payment" : "Add Payment"}
      >
        <LoanPaymentForm
          accounts={accounts}
          payment={editingPayment}
          onSubmit={editingPayment ? handleUpdatePayment : handleCreatePayment}
          onCancel={() => { setShowPaymentForm(false); setEditingPayment(null); setPaymentLoanId(null); }}
        />
      </Modal>

      {/* Delete Loan Confirm */}
      <ConfirmDialog
        open={deletingLoan !== null}
        onClose={() => setDeletingLoan(null)}
        onConfirm={handleDeleteLoan}
        title="Delete Loan"
        message={`Delete "${deletingLoan?.name}"? This will fail if the loan has payments.`}
      />

      {/* Delete Payment Confirm */}
      <ConfirmDialog
        open={deletingPayment !== null}
        onClose={() => setDeletingPayment(null)}
        onConfirm={handleDeletePayment}
        title="Delete Payment"
        message={`Delete this ${formatPKR(deletingPayment?.amount ?? 0)} payment?`}
      />
    </>
  );
}
