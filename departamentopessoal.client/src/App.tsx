import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/auth/PrivateRoute'
import { MainLayout } from './components/layout/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { ColaboradoresPage } from './pages/colaboradores/ColaboradoresPage'
import { ColaboradorFormPage } from './pages/colaboradores/ColaboradorFormPage'
import { SalariosPage } from './pages/salarios/SalariosPage'
import { AbonosPage } from './pages/abonos/AbonosPage'
import { PontoPage } from './pages/ponto/PontoPage'
import { UsuariosPage } from './pages/usuarios/UsuariosPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/colaboradores" element={<ColaboradoresPage />} />
                <Route path="/colaboradores/novo" element={<ColaboradorFormPage />} />
                <Route path="/colaboradores/:id" element={<ColaboradorFormPage />} />
                <Route path="/salarios" element={<SalariosPage />} />
                <Route path="/abonos" element={<AbonosPage />} />
                <Route path="/ponto" element={<PontoPage />} />
                <Route path="/usuarios" element={<UsuariosPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
