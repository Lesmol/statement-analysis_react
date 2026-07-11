import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext.tsx"
import { useAuth } from "@/hooks/useAuth.ts"
import { DashboardProvider } from "@/modules/dashboard/context/DashboardContext.tsx"
import { ROUTES } from "@/routes.ts"
import LoginPage from "@/modules/login/pages/LoginPage.tsx"
import UploadPage from "@/modules/dashboard/pages/UploadPage.tsx"
import ProcessingPage from "@/modules/dashboard/pages/ProcessingPage.tsx"
import ReportPage from "@/modules/dashboard/pages/ReportPage.tsx"

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

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.UPLOAD} element={<UploadPage />} />
              <Route path={ROUTES.PROCESSING} element={<ProcessingPage />} />
              <Route path={ROUTES.DASHBOARD} element={<ReportPage />} />
            </Route>
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
