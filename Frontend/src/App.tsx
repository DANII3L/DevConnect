import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/Router';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
