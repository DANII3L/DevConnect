import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutos - evita refetch automático
      gcTime: 30 * 60 * 1000, // 30 minutos - mantiene cache más tiempo
      refetchOnWindowFocus: false, // No refetch al cambiar de ventana
      refetchOnMount: false, // No refetch al montar componente
      refetchOnReconnect: false, // No refetch al reconectar
      retry: 1, // Solo 1 reintento en caso de error
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
