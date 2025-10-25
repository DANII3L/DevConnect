import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './UI/ErrorBoundary';
import { LoadingSpinner } from './UI/LoadingSpinner';

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

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return user ? <Navigate to="/" replace /> : <>{children}</>;
}

export function AppRouter() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
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
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Página 404 */}
                    <Route path="/404" element={<NotFoundPage />} />

                    {/* Ruta por defecto */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
