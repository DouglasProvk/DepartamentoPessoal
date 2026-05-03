import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/auth/PrivateRoute'
import { MainLayout } from './components/layout/MainLayout'
import { PortalLayout } from './components/layout/PortalLayout'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { ColaboradoresPage } from './pages/colaboradores/ColaboradoresPage'
import { ColaboradorFormPage } from './pages/colaboradores/ColaboradorFormPage'
import { SalariosPage } from './pages/salarios/SalariosPage'
import { AbonosPage } from './pages/abonos/AbonosPage'
import { PontoPage } from './pages/ponto/PontoPage'
import { UsuariosPage } from './pages/usuarios/UsuariosPage'
import { MensagensRHPage } from './pages/mensagensrh/MensagensRHPage'
import { DashboardPortal } from './pages/portal/DashboardPortal'
import { MeusContracheques } from './pages/portal/MeusContracheques'
import { MeusDados } from './pages/portal/MeusDados'
import { MeusBeneficios } from './pages/portal/MeusBeneficios'
import { MensagensRH } from './pages/portal/MensagensRH'
import { SolicitarBeneficio } from './pages/portal/SolicitarBeneficio'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Portal do Colaborador */}
            <Route element={<PrivateRoute requiredRole="colaborador" />}>
              <Route element={<PortalLayout />}>
                <Route path="/portal" element={<DashboardPortal />} />
                <Route path="/portal/contracheques" element={<MeusContracheques />} />
                <Route path="/portal/dados" element={<MeusDados />} />
                <Route path="/portal/beneficios" element={<MeusBeneficios />} />
                <Route path="/portal/mensagens" element={<MensagensRH />} />
                <Route path="/portal/solicitacoes" element={<SolicitarBeneficio />} />
              </Route>
            </Route>

            {/* Área administrativa */}
            <Route element={<PrivateRoute requiredRole="admin" />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/colaboradores" element={<ColaboradoresPage />} />
                <Route path="/colaboradores/novo" element={<ColaboradorFormPage />} />
                <Route path="/colaboradores/:id" element={<ColaboradorFormPage />} />
                <Route path="/salarios" element={<SalariosPage />} />
                <Route path="/abonos" element={<AbonosPage />} />
                <Route path="/ponto" element={<PontoPage />} />
                <Route path="/mensagensrh" element={<MensagensRHPage />} />
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
