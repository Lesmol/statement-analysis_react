import { lazy, Suspense } from "react"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth.ts"
import { ROUTES } from "@/routes.ts"

const LoginPage = lazy(() => import("@/modules/login/pages/LoginPage.tsx"))

const SignUpPage = lazy(() => import("@/modules/login/pages/SignUpPage.tsx"))

const ForcePasswordChangePage = lazy(() => import("@/modules/login/pages/ForcePasswordChangePage.tsx"))

const UploadPage = lazy(() => import("@/modules/dashboard/pages/UploadPage.tsx"))

const ProcessingPage = lazy(() => import("@/modules/dashboard/pages/ProcessingPage.tsx"))

const ReportPage = lazy(() => import("@/modules/dashboard/pages/ReportPage.tsx"))

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return <Outlet />
}

function PublicRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to={ROUTES.UPLOAD} replace />
  return <Outlet />
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="h-6 w-6 rounded-full border-2 border-muted-foreground/30"
        style={{
          borderTopColor: "currentColor",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          <Route
            path={ROUTES.SET_PASSWORD}
            element={<ForcePasswordChangePage />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.UPLOAD} element={<UploadPage />} />
          <Route path={ROUTES.PROCESSING} element={<ProcessingPage />} />
          <Route path={ROUTES.DASHBOARD} element={<ReportPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
