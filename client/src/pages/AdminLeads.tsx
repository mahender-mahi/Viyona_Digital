import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Menu, X, Edit2, Trash2, Download, Search, Filter } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminLeads() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const leadsQuery = trpc.leads.getAll.useQuery({});
  const updateLeadMutation = trpc.leads.update.useMutation();

  const statuses = ['New', 'Contacted', 'Qualified', 'Demo Scheduled', 'Demo Completed', 'Won', 'Lost', 'Follow-up', 'Junk'];

  const filteredLeads = useMemo(() => {
    if (!leadsQuery.data) return [];

    return leadsQuery.data.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesStatus = statusFilter === '' || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leadsQuery.data, searchTerm, statusFilter]);

  const handleEditStart = (lead: any) => {
    setEditingId(lead.id);
    setEditData(lead);
  };

  const handleEditSave = async () => {
    try {
      await updateLeadMutation.mutateAsync({
        id: editData.id,
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        company: editData.company,
        status: editData.status,
        notes: editData.notes,
      });
      setEditingId(null);
      leadsQuery.refetch();
      toast.success('Lead updated successfully');
    } catch (error) {
      toast.error('Error updating lead');
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'Created Date'],
      ...filteredLeads.map(lead => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone || '',
        lead.company || '',
        lead.projectType,
        lead.budget || '',
        lead.timeline || '',
        lead.status,
        new Date(lead.createdAt).toLocaleDateString(),
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Leads exported successfully');
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
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateTo('/admin/leads')}
            className="w-full text-left px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
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
          <h1 className="text-2xl font-bold text-foreground">Leads Management</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Filters and Search */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <Button
              onClick={handleExportCSV}
              className="bg-secondary hover:bg-secondary/90 text-foreground"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Leads Table */}
          <Card className="border border-border overflow-hidden">
            {leadsQuery.isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No leads found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Phone</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Company</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Service</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        {editingId === lead.id ? (
                          <>
                            <td className="py-4 px-6">
                              <Input
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="text-sm"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <Input
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="text-sm"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <Input
                                value={editData.phone || ''}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                className="text-sm"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <Input
                                value={editData.company || ''}
                                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                                className="text-sm"
                              />
                            </td>
                            <td className="py-4 px-6 text-muted-foreground capitalize">{lead.projectType.replace('_', ' ')}</td>
                            <td className="py-4 px-6">
                              <select
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="px-2 py-1 border border-border rounded text-sm bg-background"
                              >
                                {statuses.map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-4 px-6 text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-6 flex gap-2">
                              <Button
                                onClick={handleEditSave}
                                size="sm"
                                className="bg-primary hover:bg-accent text-white"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingId(null)}
                                size="sm"
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-6 text-foreground font-medium">{lead.name}</td>
                            <td className="py-4 px-6 text-muted-foreground">{lead.email}</td>
                            <td className="py-4 px-6 text-muted-foreground">{lead.phone || '-'}</td>
                            <td className="py-4 px-6 text-muted-foreground">{lead.company || '-'}</td>
                            <td className="py-4 px-6 text-muted-foreground capitalize">{lead.projectType.replace('_', ' ')}</td>
                            <td className="py-4 px-6">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-6 flex gap-2">
                              <button
                                onClick={() => handleEditStart(lead)}
                                className="p-2 hover:bg-muted rounded transition-colors text-primary"
                              >
                                <Edit2 size={16} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLeads.length} of {leadsQuery.data?.length || 0} leads
          </div>
        </div>
      </div>
    </div>
  );
}
