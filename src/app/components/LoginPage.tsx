import { useState } from 'react';
import { LogIn, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border-subtle bg-card p-6 sm:p-8 shadow-xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Landing
        </button>

        <h1 className="text-2xl font-semibold text-foreground">Dashboard Login</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter any email"
              className="w-full rounded-lg border border-border-subtle bg-surface-dark px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aqua-blue/40"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter any password"
              className="w-full rounded-lg border border-border-subtle bg-surface-dark px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aqua-blue/40"
            />
          </div>
        </div>

        <button
          onClick={onLogin}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-aqua-blue px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
        >
          <LogIn className="w-4 h-4" />
          Login
        </button>
      </div>
    </div>
  );
}
