import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext.tsx"
import { DashboardProvider } from "@/modules/dashboard/context/DashboardContext.tsx"
import { AppRouter } from "@/AppRouter.tsx"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <AppRouter />
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App