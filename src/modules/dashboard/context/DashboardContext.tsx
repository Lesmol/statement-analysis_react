import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import type { ChartGranularity, ModalState } from "../types"
import { DEFAULT_ACCOUNTS } from "../data/mock-data"
import {
  DashboardContext,
  type DashboardContextValue,
  type DashboardState,
} from "./dashboard-context-types"

export { DashboardContext }

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    accounts: DEFAULT_ACCOUNTS.map((a) => ({ ...a })),
    selectedAccountId: "checking",
    selectedUploadId: "jun26",
    hasFile: false,
    fileName: "",
    fileSize: "",
    chartGranularity: "day",
    accountSwitcherOpen: false,
    exportOpen: false,
    exportMessage: "",
    modal: null,
    editingAccountId: null,
    editValue: "",
    username: "",
  })

  const exportTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectAccount = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        selectedAccountId: id,
        editingAccountId: null,
      })),
    []
  )

  const setSelectedAccountId = useCallback(
    (id: string) => setState((s) => ({ ...s, selectedAccountId: id })),
    []
  )

  const toggleAccountSwitcher = useCallback(
    () =>
      setState((s) => ({
        ...s,
        accountSwitcherOpen: !s.accountSwitcherOpen,
      })),
    []
  )

  const closeAccountSwitcher = useCallback(
    () => setState((s) => ({ ...s, accountSwitcherOpen: false })),
    []
  )

  const setChartGranularity = useCallback(
    (chartGranularity: ChartGranularity) =>
      setState((s) => ({ ...s, chartGranularity })),
    []
  )

  const setModal = useCallback(
    (modal: ModalState) => setState((s) => ({ ...s, modal })),
    []
  )

  const startEditAccount = useCallback(
    (id: string, currentName: string) =>
      setState((s) => ({
        ...s,
        editingAccountId: id,
        editValue: currentName,
      })),
    []
  )

  const saveEditAccount = useCallback(() => {
    setState((s) => {
      if (!s.editingAccountId || !s.editValue.trim()) {
        return { ...s, editingAccountId: null }
      }
      return {
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === s.editingAccountId
            ? { ...a, name: s.editValue.trim() }
            : a
        ),
        editingAccountId: null,
      }
    })
  }, [])

  const cancelEditAccount = useCallback(
    () => setState((s) => ({ ...s, editingAccountId: null })),
    []
  )

  const onEditChange = useCallback(
    (value: string) => setState((s) => ({ ...s, editValue: value })),
    []
  )

  const attachFile = useCallback(
    (name: string, size: string) =>
      setState((s) => ({
        ...s,
        hasFile: true,
        fileName: name,
        fileSize: size,
      })),
    []
  )

  const removeFile = useCallback(
    () =>
      setState((s) => ({
        ...s,
        hasFile: false,
        fileName: "",
        fileSize: "",
      })),
    []
  )

  const resetFileState = useCallback(
    () =>
      setState((s) => ({
        ...s,
        hasFile: false,
        fileName: "",
        fileSize: "",
        exportOpen: false,
      })),
    []
  )

  const markAccountHasReport = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === id ? { ...a, hasReport: true } : a
        ),
      })),
    []
  )

  const setUsername = useCallback(
    (username: string) => setState((s) => ({ ...s, username })),
    []
  )

  const selectUpload = useCallback(
    (id: string) => setState((s) => ({ ...s, selectedUploadId: id })),
    []
  )

  const toggleExport = useCallback(
    () => setState((s) => ({ ...s, exportOpen: !s.exportOpen })),
    []
  )

  const closeExport = useCallback(
    () => setState((s) => ({ ...s, exportOpen: false })),
    []
  )

  const flashExport = useCallback((msg: string) => {
    if (exportTimer.current) clearTimeout(exportTimer.current)
    setState((s) => ({ ...s, exportOpen: false, exportMessage: msg }))
    exportTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, exportMessage: "" }))
    }, 2400)
  }, [])

  const hasAccountWithReport = useCallback(
    () => state.accounts.some((a) => a.hasReport),
    [state.accounts]
  )

  const getFirstReportAccountId = useCallback(() => {
    const acc = state.accounts.find((a) => a.hasReport)
    return acc?.id ?? null
  }, [state.accounts])

  const value = useMemo<DashboardContextValue>(
    () => ({
      ...state,
      selectAccount,
      setSelectedAccountId,
      toggleAccountSwitcher,
      closeAccountSwitcher,
      setChartGranularity,
      setModal,
      startEditAccount,
      saveEditAccount,
      cancelEditAccount,
      onEditChange,
      attachFile,
      removeFile,
      resetFileState,
      markAccountHasReport,
      setUsername,
      selectUpload,
      toggleExport,
      closeExport,
      flashExport,
      hasAccountWithReport,
      getFirstReportAccountId,
    }),
    [
      state,
      selectAccount,
      setSelectedAccountId,
      toggleAccountSwitcher,
      closeAccountSwitcher,
      setChartGranularity,
      setModal,
      startEditAccount,
      saveEditAccount,
      cancelEditAccount,
      onEditChange,
      attachFile,
      removeFile,
      resetFileState,
      markAccountHasReport,
      setUsername,
      selectUpload,
      toggleExport,
      closeExport,
      flashExport,
      hasAccountWithReport,
      getFirstReportAccountId,
    ]
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}
