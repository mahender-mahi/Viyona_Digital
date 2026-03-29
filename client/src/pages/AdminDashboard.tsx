import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Users, TrendingUp, Calendar, AlertCircle, LogOut, Menu, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeadsToday: 0,
    demoRequests: 0,
    conversionRate: 0,
  });

  const leadsQuery = trpc.leads.getAll.useQuery({});
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    // Check admin token
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
      return;
    }

    // Calculate stats
    if (leadsQuery.data) {
      const today = new Date().toDateString();
      const newToday = leadsQuery.data.filter(
        lead => new Date(lead.createdAt).toDateString() === today
      ).length;

      setStats({
        totalLeads: leadsQuery.data.length,
        newLeadsToday: newToday,
        demoRequests: leadsQuery.data.filter(l => l.status === 'Demo Scheduled').length,
        conversionRate: leadsQuery.data.length > 0 ? Math.round((leadsQuery.data.filter(l => l.status === 'Won').length / leadsQuery.data.length) * 100) : 0,
      });
    }
  }, [leadsQuery.data, setLocation]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      localStorage.removeItem('adminToken');
      setLocation('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-foreground text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">ViyonaDigital</h2>
          <p className="text-white/60 text-sm">Admin Panel</p>
        </div>

        <nav className="space-y-2 px-4 py-8">
          <button
            onClick={() => navigateTo('/admin/dashboard')}
            className="w-full text-left px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateTo('/admin/leads')}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Leads Management
          </button>
          <button
            onClick={() => navigateTo('/admin/cms')}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            CMS Editor
          </button>
          <button
            onClick={() => navigateTo('/admin/settings')}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Settings
          </button>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-border p-4 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="w-10"></div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Leads</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalLeads}</p>
                </div>
                <Users size={32} className="text-primary/30" />
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">New Today</p>
                  <p className="text-3xl font-bold text-foreground">{stats.newLeadsToday}</p>
                </div>
                <TrendingUp size={32} className="text-secondary/30" />
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Demo Requests</p>
                  <p className="text-3xl font-bold text-foreground">{stats.demoRequests}</p>
                </div>
                <Calendar size={32} className="text-accent/30" />
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-foreground">{stats.conversionRate}%</p>
                </div>
                <AlertCircle size={32} className="text-primary/30" />
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Leads</h2>
            {leadsQuery.isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : leadsQuery.data && leadsQuery.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsQuery.data.slice(0, 5).map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-foreground">{lead.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{lead.email}</td>
                        <td className="py-3 px-4 text-muted-foreground capitalize">{lead.projectType.replace('_', ' ')}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No leads yet</p>
            )}
            <div className="mt-4">
              <Button
                onClick={() => navigateTo('/admin/leads')}
                className="bg-primary hover:bg-accent text-white"
              >
                View All Leads
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
