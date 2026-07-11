import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/routes.ts"
import { useDashboard } from "../hooks/useDashboard"

export default function ProcessingPage() {
  const navigate = useNavigate()
  const { fileName, selectedAccountId, markAccountHasReport } = useDashboard()

  useEffect(() => {
    const timer = setTimeout(() => {
      markAccountHasReport(selectedAccountId)
      navigate(ROUTES.DASHBOARD, { replace: true })
    }, 1800)

    return () => clearTimeout(timer)
  }, [navigate, selectedAccountId, markAccountHasReport])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <div
        className="h-10 w-10 rounded-full border-[3px] border-border"
        style={{
          borderTopColor: "var(--primary)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <div className="text-center">
        <div className="text-[15px] font-semibold">
          Analyzing {fileName}&hellip;
        </div>
        <div className="mt-1 text-[13px] text-muted-foreground">
          Extracting transactions and building your report
        </div>
      </div>
    </div>
  )
}
