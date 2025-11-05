import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminUserEdit } from "./pages/AdminUserEdit";
import { CommunityPage } from "./pages/CommunityPage";
import { ErrorBoundary } from "./UI/ErrorBoundary";
import { LoadingSpinner } from "./UI/LoadingSpinner";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <Navigate to="/projects" replace /> : <>{children}</>;
}

function GlobalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const showNavbar = location.pathname !== "/auth";
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className={`min-h-screen flex flex-col ${isAuthPage ? '' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'}`}>
      {showNavbar && <Navbar />}
      <main className={`flex-1 ${isAuthPage ? 'relative' : ''}`}>
        {children}
      </main>
      {showNavbar && <Footer />}
    </div>
  );
}

export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GlobalLayout>
          <Routes>
            {/* Ruta pública - Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Rutas públicas */}
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* 👥 Ruta de comunidad */}
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />

            {/* 👤 Ruta de visualización de perfil */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 🔐 Rutas de administrador */}
            <Route
              path="/admin/user/:userId"
              element={
                <AdminRoute>
                  <AdminUserEdit />
                </AdminRoute>
              }
            />

            {/* Página 404 */}
            <Route path="/404" element={<NotFoundPage />} />

            {/* Ruta por defecto */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </GlobalLayout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}