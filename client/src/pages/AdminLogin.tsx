import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock, Mail } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual admin authentication
    // For now, use hardcoded credentials for demo
    if (credentials.email === 'admin@viyonadigital.com' && credentials.password === 'admin123') {
      localStorage.setItem('adminToken', 'demo-token-' + Date.now());
      toast.success('Login successful!');
      setLocation('/admin/dashboard');
    } else {
      toast.error('Invalid credentials');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Sign in to manage your agency</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="email"
                placeholder="admin@viyonadigital.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Email: admin@viyonadigital.com<br />
            Password: admin123
          </p>
        </div>
      </Card>
    </div>
  );
}
