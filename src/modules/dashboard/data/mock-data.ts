import type {
  Account,
  Anomaly,
  Category,
  Transaction,
  TrendPoint,
  Upload,
} from "../types"

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "checking", name: "Everyday Checking", mask: "4821", hasReport: true },
  {
    id: "savings",
    name: "High-Yield Savings",
    mask: "2290",
    hasReport: false,
  },
]

export const CATEGORIES: Category[] = [
  { name: "Housing", pct: 32, hue: 258 },
  { name: "Food & Dining", pct: 18, hue: 25 },
  { name: "Shopping", pct: 14, hue: 320 },
  { name: "Transport", pct: 12, hue: 190 },
  { name: "Utilities", pct: 9, hue: 85 },
  { name: "Entertainment", pct: 8, hue: 155 },
  { name: "Other", pct: 7, hue: 0 },
]

export const MONTHLY_TREND: TrendPoint[] = [
  { label: "Jan", income: 4550, expense: 3480 },
  { label: "Feb", income: 4550, expense: 3120 },
  { label: "Mar", income: 4900, expense: 3960 },
  { label: "Apr", income: 4550, expense: 3340 },
  { label: "May", income: 4900, expense: 3730 },
  { label: "Jun", income: 5000, expense: 4200 },
]

export const DAILY_TREND: TrendPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const income = day === 28 ? 5000 : 0
  const base =
    30 +
    ((i * 37) % 90) +
    (i % 7 === 5 ? 180 : 0) +
    (i % 9 === 0 ? 120 : 0)
  return { label: String(day), income, expense: Math.round(base) }
})

export function aggregateWeekly(daily: TrendPoint[]): TrendPoint[] {
  const weeks: TrendPoint[] = []
  for (let i = 0; i < daily.length; i += 7) {
    const chunk = daily.slice(i, i + 7)
    weeks.push({
      label: `Wk ${weeks.length + 1}`,
      income: chunk.reduce((a, d) => a + d.income, 0),
      expense: chunk.reduce((a, d) => a + d.expense, 0),
    })
  }
  return weeks
}

export const TRANSACTIONS: Transaction[] = [
  {
    date: "Jun 28",
    merchant: "Payroll Deposit",
    category: "Income",
    amount: 5000,
    positive: true,
  },
  {
    date: "Jun 24",
    merchant: "Whole Foods Market",
    category: "Food & Dining",
    amount: -186.42,
  },
  {
    date: "Jun 21",
    merchant: "Best Buy Electronics",
    category: "Shopping",
    amount: -842.0,
  },
  {
    date: "Jun 18",
    merchant: "ATM Withdrawal",
    category: "Cash",
    amount: -1200.0,
  },
  {
    date: "Jun 15",
    merchant: "Spotify",
    category: "Entertainment",
    amount: -15.99,
  },
  {
    date: "Jun 15",
    merchant: "Spotify",
    category: "Entertainment",
    amount: -15.99,
  },
  {
    date: "Jun 12",
    merchant: "Pacific Gas & Electric",
    category: "Utilities",
    amount: -164.2,
  },
  {
    date: "Jun 09",
    merchant: "Rent — Meridian Apts",
    category: "Housing",
    amount: -1850.0,
  },
  {
    date: "Jun 05",
    merchant: "Shell Gas Station",
    category: "Transport",
    amount: -58.31,
  },
  {
    date: "Jun 02",
    merchant: "Chipotle Mexican Grill",
    category: "Food & Dining",
    amount: -14.85,
  },
]

export const ANOMALIES: Anomaly[] = [
  {
    title: "Duplicate charge detected",
    desc: "Spotify billed twice on the same day (Jun 15)",
    amount: 15.99,
    date: "Jun 15",
    merchant: "Spotify",
    category: "Entertainment",
    status: "Posted",
    severity: "high",
  },
  {
    title: "Unusually large withdrawal",
    desc: "ATM withdrawal is 4.2x your average",
    amount: 1200.0,
    date: "Jun 18",
    merchant: "ATM Withdrawal",
    category: "Cash",
    status: "Posted",
    severity: "high",
  },
  {
    title: "New high-value merchant",
    desc: "First transaction with Best Buy Electronics",
    amount: 842.0,
    date: "Jun 21",
    merchant: "Best Buy Electronics",
    category: "Shopping",
    status: "Posted",
    severity: "medium",
  },
]

export const UPLOADS: Upload[] = [
  {
    id: "jun26",
    label: "June 2026",
    dateRange: "Jun 1 – Jun 30, 2026",
    net: 800,
    spark: [40, 55, 45, 70, 60, 80],
  },
  {
    id: "may26",
    label: "May 2026",
    dateRange: "May 1 – May 31, 2026",
    net: 1170,
    spark: [60, 50, 65, 55, 75, 90],
  },
  {
    id: "apr26",
    label: "April 2026",
    dateRange: "Apr 1 – Apr 30, 2026",
    net: 1210,
    spark: [50, 60, 45, 65, 58, 85],
  },
  {
    id: "mar26",
    label: "March 2026",
    dateRange: "Mar 1 – Mar 31, 2026",
    net: 940,
    spark: [70, 55, 60, 50, 65, 72],
  },
  {
    id: "feb26",
    label: "February 2026",
    dateRange: "Feb 1 – Feb 28, 2026",
    net: 1430,
    spark: [45, 65, 55, 80, 70, 88],
  },
]

export function formatCurrency(n: number): string {
  const sign = n < 0 ? "-" : ""
  return (
    sign +
    "$" +
    Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}
