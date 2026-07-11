import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/routes.ts"
import { useDashboard } from "../hooks/useDashboard"
import {
  ANOMALIES,
  CATEGORIES,
  DAILY_TREND,
  MONTHLY_TREND,
  TRANSACTIONS,
  UPLOADS,
  aggregateWeekly,
  formatCurrency,
} from "../data/mock-data"
import { DetailModal } from "../components/DetailModal"

export default function ReportPage() {
  const navigate = useNavigate()
  const { logout: authLogout } = useAuth()
  const {
    accounts,
    selectedAccountId,
    selectedUploadId,
    chartGranularity,
    accountSwitcherOpen,
    exportOpen,
    exportMessage,
    username,
    toggleAccountSwitcher,
    closeAccountSwitcher,
    setSelectedAccountId,
    resetFileState,
    setChartGranularity,
    setModal,
    selectUpload,
    toggleExport,
    flashExport,
  } = useDashboard()

  const handleLogout = () => {
    authLogout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const handleNewUpload = () => {
    resetFileState()
    navigate(ROUTES.UPLOAD)
  }

  const handleSwitchAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id)
    if (!acc) return
    setSelectedAccountId(id)
    closeAccountSwitcher()
    if (!acc.hasReport) {
      resetFileState()
      navigate(ROUTES.UPLOAD)
    }
  }

  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) ?? accounts[0]
  const currentUpload =
    UPLOADS.find((u) => u.id === selectedUploadId) ?? UPLOADS[0]
  const accountLabel = `${selectedAccount.name} \u2022\u2022\u2022\u2022 ${selectedAccount.mask}`

  // Chart data
  const trendSource =
    chartGranularity === "day"
      ? DAILY_TREND
      : chartGranularity === "week"
        ? aggregateWeekly(DAILY_TREND)
        : MONTHLY_TREND
  const maxIncome = Math.max(1, ...trendSource.map((m) => m.income))
  const maxExpense = Math.max(1, ...trendSource.map((m) => m.expense))
  const barWidth = chartGranularity === "day" ? 5 : 10
  const barGap = chartGranularity === "day" ? 1 : 3
  const groupGap = chartGranularity === "day" ? 4 : 18

  // KPIs
  const totalIncome = MONTHLY_TREND.reduce((a, m) => a + m.income, 0)
  const totalExpense = MONTHLY_TREND.reduce((a, m) => a + m.expense, 0)
  const net = totalIncome - totalExpense
  const topCategory = [...CATEGORIES].sort((a, b) => b.pct - a.pct)[0]

  const summaryText = `You brought in ${formatCurrency(totalIncome)} and spent ${formatCurrency(totalExpense)} this period, leaving a ${net >= 0 ? "positive" : "negative"} net cash flow of ${formatCurrency(Math.abs(net))}. ${topCategory.name} was your largest expense category at ${topCategory.pct}% of spending, and ${ANOMALIES.length} unusual transaction${ANOMALIES.length === 1 ? " was" : "s were"} flagged for review.`

  const userInitials = (username || "JD").slice(0, 2).toUpperCase()

  const kpis = [
    {
      label: "Total income",
      value: formatCurrency(totalIncome),
      color: "var(--positive)",
    },
    {
      label: "Total expenses",
      value: formatCurrency(totalExpense),
      color: "var(--negative)",
    },
    {
      label: "Net cash flow",
      value: formatCurrency(net),
      color: net >= 0 ? "var(--positive)" : "var(--negative)",
    },
    {
      label: "Anomalies flagged",
      value: String(ANOMALIES.length),
      color: "oklch(0.72 0.15 70)",
    },
  ]

  const granularityOptions = [
    { key: "day" as const, label: "Day" },
    { key: "week" as const, label: "Week" },
    { key: "month" as const, label: "Month" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* ===== HEADER ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-white px-7 py-3.5">
        {/* Account chip */}
        <div className="relative">
          <div
            onClick={toggleAccountSwitcher}
            className="flex cursor-pointer items-center gap-2 rounded-[9px] border border-border bg-[oklch(0.98_0_0)] px-3 py-1.5 hover:bg-[oklch(0.95_0_0)]"
          >
            <div className="h-[7px] w-[7px] rounded-full bg-[oklch(0.4_0_0)]" />
            <span className="text-[13px] font-medium">{accountLabel}</span>
            <div className="mx-0.5 h-3.5 w-px bg-[oklch(0.9_0_0)]" />
            <span className="text-[13px] text-muted-foreground">
              {currentUpload.dateRange}
            </span>
            <div
              className="-mt-[3px] ml-0.5 h-[7px] w-[7px]"
              style={{
                borderRight: "1.5px solid oklch(0.556 0 0)",
                borderBottom: "1.5px solid oklch(0.556 0 0)",
                transform: "rotate(45deg)",
              }}
            />
          </div>

          {/* Account switcher dropdown */}
          {accountSwitcherOpen && (
            <div
              className="absolute left-0 top-[42px] z-20 w-60 rounded-[10px] border border-border bg-white p-1.5"
              style={{ boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)" }}
            >
              {accounts.map((a) => {
                const isCurrent = a.id === selectedAccountId
                return (
                  <div
                    key={a.id}
                    onClick={() => handleSwitchAccount(a.id)}
                    className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[7px] px-2.5 py-[9px] hover:bg-muted"
                    style={{
                      background: isCurrent
                        ? "var(--primary-soft)"
                        : undefined,
                    }}
                  >
                    <div>
                      <div className="text-[13px] font-semibold">{a.name}</div>
                      <div className="text-[11.5px] text-muted-foreground">
                        &bull;&bull;&bull;&bull; {a.mask}
                        {!a.hasReport &&
                          " \u00b7 No report yet \u2014 upload to view"}
                      </div>
                    </div>
                    {isCurrent && (
                      <div
                        className="h-[7px] w-[7px] rounded-full"
                        style={{ background: "var(--primary)" }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleNewUpload}
            className="h-8 cursor-pointer rounded-lg border border-border bg-white px-3.5 font-sans text-[13px] font-semibold text-foreground hover:bg-muted"
          >
            New upload
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={toggleExport}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border-none bg-primary px-3.5 font-sans text-[13px] font-semibold text-white"
            >
              Export
            </button>
            {exportOpen && (
              <div
                className="absolute right-0 top-[38px] z-20 w-[190px] rounded-[10px] border border-border bg-white p-1.5"
                style={{ boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)" }}
              >
                {[
                  {
                    label: "Email report",
                    action: () =>
                      flashExport("Report emailed to your inbox."),
                  },
                  {
                    label: "Download PDF",
                    action: () => flashExport("PDF downloaded."),
                  },
                  {
                    label: "Export to Excel",
                    action: () => flashExport("Exported to Excel."),
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full cursor-pointer rounded-[7px] border-none bg-transparent px-2.5 py-[9px] text-left font-sans text-[13px] text-foreground hover:bg-muted"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Avatar / logout */}
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-muted font-heading text-xs font-bold text-foreground"
          >
            {userInitials}
          </button>
        </div>
      </div>

      {/* Export confirmation banner */}
      {exportMessage && (
        <div className="border-b border-border bg-[oklch(0.95_0_0)] px-7 py-[9px] text-center text-[13px] font-medium text-[oklch(0.25_0_0)]">
          {exportMessage}
        </div>
      )}

      {/* ===== BODY ===== */}
      <div className="flex min-h-0 min-w-0 flex-1">
        {/* Report content */}
        <div className="flex flex-1 justify-center overflow-auto px-6 py-7 pb-15">
          <div className="flex w-[760px] max-w-full flex-col gap-5">
            {/* Title row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-heading text-xl font-bold">
                  {currentUpload.label} statement report
                </div>
                <div className="mt-1 text-[13px] text-muted-foreground">
                  {accountLabel}
                </div>
              </div>
              <button
                onClick={handleNewUpload}
                className="h-[34px] flex-none cursor-pointer rounded-lg border border-border bg-white px-3.5 font-sans text-[13px] font-semibold text-foreground hover:bg-muted"
              >
                + New upload
              </button>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-[11px] border border-border bg-white p-3.5"
                  style={{ borderLeft: `3px solid ${k.color}` }}
                >
                  <div className="text-[11.5px] font-medium text-muted-foreground">
                    {k.label}
                  </div>
                  <div className="mt-[5px] font-heading text-lg font-bold">
                    {k.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <div className="rounded-[13px] border border-border bg-primary-soft px-5 py-[18px]">
              <div className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-primary">
                Summary
              </div>
              <div className="text-sm leading-relaxed text-[oklch(0.25_0_0)]">
                {summaryText}
              </div>
            </div>

            {/* Income vs. Expenses chart */}
            <div className="rounded-[13px] border border-border bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold">
                  Income vs. expenses
                </div>
                <div className="flex gap-0.5 rounded-lg border border-border bg-muted p-[3px]">
                  {granularityOptions.map((g) => {
                    const active = chartGranularity === g.key
                    return (
                      <button
                        key={g.key}
                        onClick={() => setChartGranularity(g.key)}
                        className="h-6 cursor-pointer rounded-md border-none px-[11px] font-sans text-xs font-semibold"
                        style={{
                          background: active ? "white" : "transparent",
                          color: active
                            ? "var(--foreground)"
                            : "var(--muted-foreground)",
                        }}
                      >
                        {g.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bar chart */}
              <div
                className="flex items-end overflow-x-auto px-1"
                style={{ height: 130, gap: `${groupGap}px` }}
              >
                {trendSource.map((m, i) => {
                  const showLabel =
                    chartGranularity !== "day" ||
                    i % 5 === 0 ||
                    i === trendSource.length - 1
                  const incomeH = Math.round((m.income / maxIncome) * 118)
                  const expenseH = Math.round((m.expense / maxExpense) * 118)
                  return (
                    <div
                      key={i}
                      className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                    >
                      <div
                        className="flex items-end"
                        style={{ height: 100, gap: `${barGap}px` }}
                      >
                        <div
                          className="rounded-t-sm"
                          style={{
                            width: barWidth,
                            height: incomeH,
                            background: "oklch(0.62 0.12 155)",
                          }}
                        />
                        <div
                          className="rounded-t-sm"
                          style={{
                            width: barWidth,
                            height: expenseH,
                            background: "oklch(0.4 0.15 25)",
                          }}
                        />
                      </div>
                      <div className="whitespace-nowrap text-[10.5px] text-muted-foreground">
                        {showLabel ? m.label : "\u00a0"}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-3.5 flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-sm bg-[oklch(0.62_0.12_155)]" />
                  Income
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-sm bg-[oklch(0.4_0.15_25)]" />
                  Expenses
                </div>
              </div>
            </div>

            {/* Categories + Anomalies side by side */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
              {/* Spending by category */}
              <div className="min-w-0 rounded-[13px] border border-border bg-white p-5">
                <div className="mb-3.5 text-sm font-semibold">
                  Spending by category
                </div>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map((c) => (
                    <div
                      key={c.name}
                      onClick={() =>
                        setModal({ type: "category", categoryName: c.name })
                      }
                      className="-mx-1.5 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted"
                    >
                      <div
                        className="h-2 w-2 flex-none rounded-sm"
                        style={{
                          background: `oklch(0.62 0.11 ${c.hue})`,
                        }}
                      />
                      <span className="flex-1 text-[12.5px]">{c.name}</span>
                      <span className="text-[12.5px] text-muted-foreground">
                        {c.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flagged anomalies */}
              <div className="flex min-w-0 flex-col gap-[9px] rounded-[13px] border border-border bg-white p-5">
                <div className="mb-[5px] text-sm font-semibold">
                  Flagged anomalies
                </div>
                {ANOMALIES.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => setModal({ type: "anomaly", anomaly: a })}
                    className="-mx-1.5 flex cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-1 hover:bg-muted"
                  >
                    <div
                      className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-md text-[11px] font-bold"
                      style={{
                        background:
                          a.severity === "high"
                            ? "oklch(0.6 0.16 25 / 0.14)"
                            : "oklch(0.72 0.15 70 / 0.18)",
                        color:
                          a.severity === "high"
                            ? "oklch(0.5 0.18 25)"
                            : "oklch(0.45 0.13 70)",
                      }}
                    >
                      !
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold">
                        {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(a.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions list */}
            <div className="overflow-auto rounded-[13px] border border-border bg-white p-5">
              <div className="mb-3.5 text-sm font-semibold">Transactions</div>
              <div className="min-w-[420px]">
                {TRANSACTIONS.map((t, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setModal({ type: "transaction", txn: t })
                    }
                    className="-mx-1.5 flex cursor-pointer items-center justify-between rounded-md border-b border-[oklch(0.95_0_0)] px-1.5 py-2.5 text-[13px] hover:bg-muted"
                  >
                    <div className="flex min-w-0 gap-3.5">
                      <div className="w-[52px] flex-none text-muted-foreground">
                        {t.date}
                      </div>
                      <div className="font-medium">{t.merchant}</div>
                    </div>
                    <div
                      className="font-semibold"
                      style={{
                        color:
                          t.amount > 0
                            ? "var(--positive)"
                            : "var(--negative)",
                      }}
                    >
                      {t.amount > 0 ? "+" : ""}
                      {formatCurrency(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== UPLOAD HISTORY RAIL ===== */}
        <div className="flex w-[220px] flex-none flex-col gap-3.5 overflow-auto border-l border-border bg-white px-3.5 py-[18px]">
          <div>
            <div className="text-[13.5px] font-semibold">Upload history</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Trends across past statements
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {UPLOADS.map((u) => {
              const selected = u.id === selectedUploadId
              const maxSpark = Math.max(...u.spark)
              return (
                <div
                  key={u.id}
                  onClick={() => selectUpload(u.id)}
                  className="cursor-pointer rounded-[11px] p-3"
                  style={{
                    border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                    background: selected
                      ? "var(--primary-soft)"
                      : "white",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold">{u.label}</div>
                    <div
                      className="text-[11.5px] font-bold"
                      style={{
                        color:
                          u.net >= 0
                            ? "oklch(0.5 0.14 155)"
                            : "var(--negative)",
                      }}
                    >
                      {u.net > 0 ? "+" : ""}
                      {formatCurrency(u.net)}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {u.dateRange}
                  </div>
                  {/* Sparkline */}
                  <div className="mt-2.5 flex items-end gap-[3px]" style={{ height: 28 }}>
                    {u.spark.map((v, j) => (
                      <div
                        key={j}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height:
                            Math.round((v / maxSpark) * 26) + 2,
                          background: selected
                            ? "var(--primary)"
                            : "oklch(0.82 0 0)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="border-t border-[oklch(0.95_0_0)] pt-1 text-[11.5px] leading-relaxed text-[oklch(0.6_0_0)]">
            Comparing trends across uploads highlights recurring spend patterns
            and shifts in cash flow over time.
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <DetailModal />
    </div>
  )
}
