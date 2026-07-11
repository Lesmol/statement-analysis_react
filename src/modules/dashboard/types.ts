export type ChartGranularity = "day" | "week" | "month"

export interface Account {
  id: string
  name: string
  mask: string
  hasReport: boolean
}

export interface Category {
  name: string
  pct: number
  hue: number
}

export interface TrendPoint {
  label: string
  income: number
  expense: number
}

export interface Transaction {
  date: string
  merchant: string
  category: string
  amount: number
  positive?: boolean
}

export interface Anomaly {
  title: string
  desc: string
  amount: number
  date: string
  merchant: string
  category: string
  status: string
  severity: "high" | "medium"
}

export interface Upload {
  id: string
  label: string
  dateRange: string
  net: number
  spark: number[]
}

export type ModalState =
  | null
  | { type: "category"; categoryName: string }
  | { type: "anomaly"; anomaly: Anomaly }
  | { type: "transaction"; txn: Transaction }
