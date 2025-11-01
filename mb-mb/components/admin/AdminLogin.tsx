import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Moon, Sun, Lock, Eye, EyeOff } from 'lucide-react';
import adminLogo from 'figma:asset/4460c1e9675ba5671e9e370a99ca83e83eca2146.png';

// Admin Logo Component
const AdminLogo = () => (
  <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg">
    <img src={adminLogo} alt="Admin" className="w-6 h-6 object-contain" />
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
  </div>
);

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`w-full max-w-md mx-4 relative ${darkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-gray-200'} rounded-2xl border backdrop-blur-sm shadow-2xl`}>
        {/* Header */}
        <div className={`border-b ${darkMode ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50'} px-6 py-5 flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <AdminLogo />
            <h1 className={`text-xl font-bold ${darkMode ? 'bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent' : 'text-gray-900'}`}>
              fAdmin Login
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className={`text-3xl text-center mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Access
          </h2>
          <p className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your credentials to access the dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center animate-shake">
              <span className="font-semibold">⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="username" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`mt-2 h-12 ${darkMode ? 'bg-slate-800 border-slate-600 text-white placeholder:text-gray-500 focus:border-pink-500' : 'bg-white border-gray-300 text-gray-900'} transition-all`}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`mt-2 h-12 pr-12 ${darkMode ? 'bg-slate-800 border-slate-600 text-white placeholder:text-gray-500 focus:border-pink-500' : 'bg-white border-gray-300 text-gray-900'} transition-all`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 mt-1 p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  {showPassword ? (
                    <EyeOff className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 mt-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className={`border-t ${darkMode ? 'border-slate-700/50 bg-slate-800/30' : 'border-gray-200 bg-gray-50'} px-6 py-4 text-center rounded-b-2xl`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            🛡️ fAdmin Dashboard v3.0 - Secure Real-Time Monitoring
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
            Powered by Supabase Broadcast
          </p>
        </div>
      </div>
    </div>
  );
}
