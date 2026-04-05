// src/components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api'; // Imported the API for registration

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // State to track if the user is logging in or creating a new account
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        // Register the new user in the backend
        await api.register(email, password);
        // Automatically log them in right after successful registration
        await login(email, password);
      } else {
        // Normal login flow
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white flex flex-col">
      
      {/* Exactly matching Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-[1024px] mx-auto px-4 h-14 flex justify-between items-center text-[12px] font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1D1D1F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span className="text-gray-800">TaskManager Pro</span>
          </div>
          {/* Empty right side to balance the nav */}
          <div></div> 
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-24 mt-[-40px]">
        
        {/* Dynamic Hero Typography */}
        <div className="mb-10 text-center transition-all duration-300">
          <h1 className="text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1D1D1F] leading-tight">
            {isRegistering ? 'Create Account.' : 'Sign In.'} <br className="hidden sm:block"/>
            <span className="text-[#86868B]">
              {isRegistering ? 'Join the workspace.' : 'Manage your tasks here.'}
            </span>
          </h1>
        </div>
        
        {/* The Unified Form Container */}
        <div className="w-full max-w-[440px] bg-white rounded-[24px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          
          {error && (
            <div className="mb-6 p-4 rounded-[14px] bg-[#FFF2F2] border border-[#FFD1D1] text-[#E30000] text-[14px] font-medium text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Inputs matching the Dashboard's "Add Task" perfectly */}
            <div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Email address"
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[18px] outline-none text-[17px] text-[#1D1D1F] placeholder:text-[#86868B] shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:ring-[3px] focus:ring-[#0071E3]/30 transition-all"
              />
            </div>
            
            <div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Password"
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[18px] outline-none text-[17px] text-[#1D1D1F] placeholder:text-[#86868B] shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:ring-[3px] focus:ring-[#0071E3]/30 transition-all"
              />
            </div>
            
            {/* Dynamic Button */}
            <button 
              type="submit" 
              className="w-full mt-2 px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[17px] rounded-[18px] transition-colors shadow-sm"
            >
              {isRegistering ? 'Sign Up' : 'Continue'}
            </button>
          </form>

          {/* Toggle Button for changing modes */}
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(''); // Clear any lingering errors when switching
              }}
              className="text-[15px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors"
            >
              {isRegistering 
                ? 'Already have an account? Sign in.' 
                : "Don't have an account? Create one."}
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}