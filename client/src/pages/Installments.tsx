import { useState, useCallback } from "react";
import { useInstallmentPlans } from "../hooks/useInstallmentPlans";
import { useAccounts } from "../hooks/useAccounts";
import { useIncomeSources } from "../hooks/useIncomeSources";
import { incomesApi } from "../api/incomes.api";
import InstallmentPlanForm from "../components/installments/InstallmentPlanForm";
import InstallmentPaymentForm from "../components/installments/InstallmentPaymentForm";
import InstallmentPaymentList from "../components/installments/InstallmentPaymentList";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { InstallmentPlan, Income } from "../types";
import { formatPKR } from "../utils/format";

const INSTALLMENT_PAYMENT_SOURCE = "Installment Payment";

export default function Installments() {
  const { plans, loading, create, update, remove, getPayments } = useInstallmentPlans();
  const { accounts } = useAccounts();
  const { incomeSources } = useIncomeSources();
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InstallmentPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<InstallmentPlan | null>(null);

  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);
  const [planPayments, setPlanPayments] = useState<Record<number, Income[]>>({});
  const [paymentsLoading, setPaymentsLoading] = useState<number | null>(null);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentPlanId, setPaymentPlanId] = useState<number | null>(null);
  const [editingPayment, setEditingPayment] = useState<Income | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Income | null>(null);

  const installmentSourceId = incomeSources.find((s) => s.name === INSTALLMENT_PAYMENT_SOURCE)?.id;

  const fetchPayments = useCallback(async (planId: number) => {
    setPaymentsLoading(planId);
    try {
      const payments = await getPayments(planId);
      setPlanPayments((prev) => ({ ...prev, [planId]: payments }));
    } catch {
      // silently fail
    } finally {
      setPaymentsLoading(null);
    }
  }, [getPayments]);

  const togglePlan = (planId: number) => {
    if (expandedPlanId === planId) {
      setExpandedPlanId(null);
    } else {
      setExpandedPlanId(planId);
      if (!planPayments[planId]) {
        fetchPayments(planId);
      }
    }
  };

  const handleCreatePlan = async (data: Parameters<typeof create>[0]) => {
    await create(data);
    setShowPlanForm(false);
  };

  const handleUpdatePlan = async (data: Parameters<typeof update>[1]) => {
    if (!editingPlan) return;
    await update(editingPlan.id, data);
    setEditingPlan(null);
    setShowPlanForm(false);
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    try {
      await remove(deletingPlan.id);
      setDeletingPlan(null);
    } catch {
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
    reference_number: string;
  }) => {
    if (!paymentPlanId || !installmentSourceId) return;
    await incomesApi.create({
      ...data,
      income_source_id: installmentSourceId,
      installment_plan_id: paymentPlanId,
      reference_number: data.reference_number,
    });
    setShowPaymentForm(false);
    const planId = paymentPlanId;
    setPaymentPlanId(null);
    await fetchPayments(planId);
  };

  const handleUpdatePayment = async (data: {
    account_id: number;
    amount: number;
    description: string;
    date: string;
    month: number;
    year: number;
    reference_number: string;
  }) => {
    if (!editingPayment || !installmentSourceId) return;
    await incomesApi.update(editingPayment.id, {
      ...data,
      income_source_id: installmentSourceId,
      installment_plan_id: editingPayment.installment_plan_id ?? undefined,
      reference_number: data.reference_number,
    });
    setEditingPayment(null);
    setShowPaymentForm(false);
    if (editingPayment.installment_plan_id) {
      await fetchPayments(editingPayment.installment_plan_id);
    }
  };

  const handleDeletePayment = async () => {
    if (!deletingPayment) return;
    const planId = deletingPayment.installment_plan_id;
    await incomesApi.delete(deletingPayment.id);
    setDeletingPayment(null);
    if (planId) {
      await fetchPayments(planId);
    }
  };

  const getPlanReceivedTotal = (planId: number) => {
    const payments = planPayments[planId];
    if (!payments) return 0;
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Installment Plans</h2>
        <button
          onClick={() => { setEditingPlan(null); setShowPlanForm(true); }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add Plan
        </button>
      </header>
      <div className="p-4 md:p-6 space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : plans.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No installment plans yet. Click "Add Plan" to get started.</div>
        ) : (
          plans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;
            const payments = planPayments[plan.id] ?? [];
            const receivedTotal = getPlanReceivedTotal(plan.id);
            const outstanding = plan.total_amount - receivedTotal;
            const progress = plan.total_amount > 0 ? (receivedTotal / plan.total_amount) * 100 : 0;

            return (
              <div key={plan.id} className="bg-white rounded-xl border border-gray-200">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => togglePlan(plan.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 truncate">{plan.name}</h3>
                      <span className="text-xs text-gray-500 hidden sm:inline">Buyer: {plan.buyer_name}</span>
                      {plan.description && (
                        <span className="text-xs text-gray-400 hidden md:inline">({plan.description})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Expected: {formatPKR(plan.total_amount)}</span>
                      {planPayments[plan.id] && (
                        <>
                          <span>Received: {formatPKR(receivedTotal)}</span>
                          <span className={outstanding > 0 ? "text-amber-600" : "text-green-600"}>
                            {outstanding > 0 ? `Outstanding: ${formatPKR(outstanding)}` : "Fully Received"}
                          </span>
                        </>
                      )}
                    </div>
                    {planPayments[plan.id] && plan.total_amount > 0 && (
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
                        setPaymentPlanId(plan.id);
                        setEditingPayment(null);
                        setShowPaymentForm(true);
                      }}
                      className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Payment
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingPlan(plan); setShowPlanForm(true); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletingPlan(plan); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {paymentsLoading === plan.id ? (
                      <div className="p-4 text-gray-500 text-sm">Loading payments...</div>
                    ) : (
                      <InstallmentPaymentList
                        payments={payments}
                        total={receivedTotal}
                        onEdit={(p) => {
                          setEditingPayment(p);
                          setPaymentPlanId(plan.id);
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

      {/* Plan Form Modal */}
      <Modal
        open={showPlanForm}
        onClose={() => { setShowPlanForm(false); setEditingPlan(null); }}
        title={editingPlan ? "Edit Installment Plan" : "Add Installment Plan"}
      >
        <InstallmentPlanForm
          plan={editingPlan}
          onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
          onCancel={() => { setShowPlanForm(false); setEditingPlan(null); }}
        />
      </Modal>

      {/* Payment Form Modal */}
      <Modal
        open={showPaymentForm}
        onClose={() => { setShowPaymentForm(false); setEditingPayment(null); setPaymentPlanId(null); }}
        title={editingPayment ? "Edit Payment" : "Record Payment"}
      >
        <InstallmentPaymentForm
          accounts={accounts}
          payment={editingPayment}
          onSubmit={editingPayment ? handleUpdatePayment : handleCreatePayment}
          onCancel={() => { setShowPaymentForm(false); setEditingPayment(null); setPaymentPlanId(null); }}
        />
      </Modal>

      {/* Delete Plan Confirm */}
      <ConfirmDialog
        open={deletingPlan !== null}
        onClose={() => setDeletingPlan(null)}
        onConfirm={handleDeletePlan}
        title="Delete Installment Plan"
        message={`Delete "${deletingPlan?.name}"? This will fail if the plan has payments.`}
      />

      {/* Delete Payment Confirm */}
      <ConfirmDialog
        open={deletingPayment !== null}
        onClose={() => setDeletingPayment(null)}
        onConfirm={handleDeletePayment}
        title="Delete Payment"
        message={`Delete this ${formatPKR(deletingPayment?.amount ?? 0)} payment? This will also reverse the account credit.`}
      />
    </>
  );
}
