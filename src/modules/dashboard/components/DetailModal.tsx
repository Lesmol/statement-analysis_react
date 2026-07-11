import { useDashboard } from "../hooks/useDashboard"
import {
  TRANSACTIONS,
  formatCurrency,
} from "../data/mock-data"

export function DetailModal() {
  const { modal, setModal } = useDashboard()
  if (!modal) return null

  const isCategoryModal = modal.type === "category"

  let title = ""
  let subtitle = ""
  let categoryTxns: { date: string; merchant: string; amount: string }[] = []
  let fields: { label: string; value: string }[] = []

  if (isCategoryModal) {
    title = modal.categoryName
    const matches = TRANSACTIONS.filter(
      (t) => t.category === modal.categoryName
    )
    subtitle = `${matches.length} transaction${matches.length === 1 ? "" : "s"} this period`
    categoryTxns = matches.map((t) => ({
      date: t.date,
      merchant: t.merchant,
      amount: (t.amount > 0 ? "+" : "") + formatCurrency(t.amount),
    }))
  } else if (modal.type === "anomaly") {
    title = modal.anomaly.title
    subtitle = modal.anomaly.desc
    fields = [
      { label: "Transaction", value: modal.anomaly.merchant },
      { label: "Date", value: modal.anomaly.date },
      { label: "Category", value: modal.anomaly.category },
      { label: "Amount", value: formatCurrency(modal.anomaly.amount) },
      { label: "Status", value: modal.anomaly.status },
    ]
  } else if (modal.type === "transaction") {
    title = modal.txn.merchant
    subtitle = modal.txn.category
    fields = [
      { label: "Date", value: modal.txn.date },
      { label: "Category", value: modal.txn.category },
      {
        label: "Amount",
        value:
          (modal.txn.amount > 0 ? "+" : "") +
          formatCurrency(modal.txn.amount),
      },
      { label: "Status", value: "Posted" },
    ]
  }

  return (
    <div
      onClick={() => setModal(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "oklch(0.145 0 0 / 0.35)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[420px] max-w-full max-h-[80vh] overflow-auto bg-white rounded-[14px] p-6"
        style={{ boxShadow: "0 20px 48px oklch(0 0 0 / 0.2)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="text-base font-bold">{title}</div>
          <button
            onClick={() => setModal(null)}
            className="flex-none w-[26px] h-[26px] rounded-full bg-[oklch(0.96_0_0)] text-[oklch(0.4_0_0)] text-sm cursor-pointer border-none"
          >
            &times;
          </button>
        </div>
        <div className="text-[13px] text-muted-foreground mb-[18px]">
          {subtitle}
        </div>

        {isCategoryModal ? (
          <div className="flex flex-col">
            {categoryTxns.map((ct, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2.5 border-b border-[oklch(0.95_0_0)] text-[13px]"
              >
                <div className="flex gap-3.5">
                  <div className="text-muted-foreground w-[52px] flex-none">
                    {ct.date}
                  </div>
                  <div className="font-medium">{ct.merchant}</div>
                </div>
                <div className="font-semibold">{ct.amount}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {fields.map((f, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-[13.5px] pb-2.5 border-b border-[oklch(0.95_0_0)]"
              >
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold">{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
