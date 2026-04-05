import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function MainRouter() {
  const { isAuthenticated } = useAuth();
  
  // A beautiful global background for our app
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}