import { useRef, type DragEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/routes.ts"
import { useDashboard } from "../hooks/useDashboard"

export default function UploadPage() {
  const navigate = useNavigate()
  const { logout: authLogout } = useAuth()
  const {
    accounts,
    selectedAccountId,
    editingAccountId,
    editValue,
    hasFile,
    fileName,
    fileSize,
    selectAccount,
    startEditAccount,
    saveEditAccount,
    cancelEditAccount,
    onEditChange,
    attachFile,
    removeFile,
  } = useDashboard()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    authLogout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const handleAnalyze = () => {
    if (!hasFile) return
    navigate(ROUTES.PROCESSING)
  }

  const handleFileSelect = (file: File) => {
    const sizeKB = Math.round(file.size / 1024)
    const sizeLabel =
      sizeKB >= 1024
        ? `${(sizeKB / 1024).toFixed(1)} MB`
        : `${sizeKB} KB`
    attachFile(file.name, sizeLabel)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const fileExt = fileName.split(".").pop()?.toUpperCase() ?? "FILE"

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-end border-b border-border bg-white px-8 py-4">
        <button
          onClick={handleLogout}
          className="h-8 cursor-pointer rounded-lg border border-border bg-white px-3.5 font-sans text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Log out
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-start justify-center px-6 pt-12">
        <div
          className="flex w-[520px] max-w-full flex-col gap-[26px]"
          style={{ animation: "fade-up 0.4s ease" }}
        >
          {/* Title */}
          <div>
            <div className="font-heading text-[22px] font-bold tracking-tight">
              Upload a statement
            </div>
            <div className="mt-1 text-[13.5px] text-muted-foreground">
              We&apos;ll read the document and build your analysis dashboard
              automatically.
            </div>
          </div>

          {/* Account selector */}
          <div>
            <div className="mb-2.5 text-[13px] font-semibold">
              Upload to account
            </div>
            <div className="flex flex-col gap-2">
              {accounts.map((acc) => {
                const selected = acc.id === selectedAccountId
                const isEditing = editingAccountId === acc.id
                return (
                  <div
                    key={acc.id}
                    onClick={() => selectAccount(acc.id)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[11px] px-3.5 py-3"
                    style={{
                      border: `1.5px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                      background: selected
                        ? "var(--primary-soft)"
                        : "white",
                    }}
                  >
                    {/* Radio */}
                    <div
                      className="flex h-4 w-4 flex-none items-center justify-center rounded-full"
                      style={{
                        border: `1.5px solid ${selected ? "var(--primary)" : "oklch(0.8 0 0)"}`,
                      }}
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: selected
                            ? "var(--primary)"
                            : "transparent",
                        }}
                      />
                    </div>

                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => onEditChange(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditAccount()
                            if (e.key === "Escape") cancelEditAccount()
                          }}
                          autoFocus
                          className="h-7 flex-1 rounded-md border border-primary px-2 font-sans text-[13.5px] outline-none"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            saveEditAccount()
                          }}
                          className="flex-none cursor-pointer rounded-md border-none bg-primary px-2.5 py-[5px] text-xs font-semibold text-white"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13.5px] font-semibold">
                            {acc.name}
                          </div>
                          <div className="text-[11.5px] text-muted-foreground">
                            &bull;&bull;&bull;&bull; {acc.mask}
                            {!acc.hasReport && " \u00b7 No report yet"}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditAccount(acc.id, acc.name)
                          }}
                          className="flex-none cursor-pointer border-none bg-transparent p-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Rename
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dropzone + File + Button */}
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="cursor-pointer rounded-[14px] bg-white px-6 py-10 text-center hover:border-primary hover:bg-primary-soft"
              style={{
                border: "1.5px dashed oklch(0.8 0 0)",
              }}
            >
              {/* Upload icon */}
              <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-[11px] bg-muted">
                <div
                  className="mt-1 h-4 w-4"
                  style={{
                    borderLeft: "2px solid oklch(0.556 0 0)",
                    borderBottom: "2px solid oklch(0.556 0 0)",
                    transform: "rotate(135deg)",
                  }}
                />
              </div>
              <div className="text-sm font-semibold">
                Click to browse, or drag a file here
              </div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">
                Supports PDF, CSV — up to 20MB
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
                e.target.value = ""
              }}
            />

            {/* File chip */}
            {hasFile && (
              <div className="mt-3.5 flex items-center justify-between rounded-[11px] border border-border bg-white px-3.5 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary-soft text-[10.5px] font-bold text-primary">
                    {fileExt}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium">
                      {fileName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {fileSize}
                    </div>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="cursor-pointer border-none bg-transparent p-1.5 text-[13px] text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!hasFile}
              className="mt-[18px] w-full cursor-pointer rounded-[10px] border-none font-sans text-sm font-semibold text-white disabled:cursor-default"
              style={{
                height: 42,
                background: hasFile ? "var(--primary)" : "oklch(0.85 0 0)",
              }}
            >
              Analyze statement
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
