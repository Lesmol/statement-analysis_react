import LoginPage from "@/modules/login/pages/LoginPage.tsx";
import WelcomePage from "@/modules/welcome/WelcomePage.tsx";
import {AuthProvider} from "@/context/AuthContext.tsx";
import {useAuth} from "@/hooks/useAuth.ts";

function AppContent() {
    const {isAuthenticated} = useAuth()
    return isAuthenticated ? <WelcomePage/> : <LoginPage/>
}

export function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    )
}

export default App
