import { createContext } from "react"
import type { Account, ChartGranularity, ModalState } from "../types"

export interface DashboardState {
  accounts: Account[]
  selectedAccountId: string
  selectedUploadId: string
  hasFile: boolean
  fileName: string
  fileSize: string
  chartGranularity: ChartGranularity
  accountSwitcherOpen: boolean
  exportOpen: boolean
  exportMessage: string
  modal: ModalState
  editingAccountId: string | null
  editValue: string
  username: string
}

export interface DashboardActions {
  selectAccount: (id: string) => void
  setSelectedAccountId: (id: string) => void
  toggleAccountSwitcher: () => void
  closeAccountSwitcher: () => void
  setChartGranularity: (g: ChartGranularity) => void
  setModal: (m: ModalState) => void
  startEditAccount: (id: string, currentName: string) => void
  saveEditAccount: () => void
  cancelEditAccount: () => void
  onEditChange: (value: string) => void
  attachFile: (name: string, size: string) => void
  removeFile: () => void
  resetFileState: () => void
  markAccountHasReport: (id: string) => void
  setUsername: (username: string) => void
  selectUpload: (id: string) => void
  toggleExport: () => void
  closeExport: () => void
  flashExport: (msg: string) => void
  hasAccountWithReport: () => boolean
  getFirstReportAccountId: () => string | null
}

export type DashboardContextValue = DashboardState & DashboardActions

export const DashboardContext = createContext<
  DashboardContextValue | undefined
>(undefined)
