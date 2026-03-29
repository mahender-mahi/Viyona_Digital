import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Menu, X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminCMS() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentType, setContentType] = useState<'testimonial' | 'case_study' | 'service' | 'page_section'>('testimonial');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    authorCompany: '',
  });

  const contentQuery = trpc.siteContent.getByType.useQuery(contentType);
  const createContentMutation = trpc.siteContent.create.useMutation();
  const updateContentMutation = trpc.siteContent.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateContentMutation.mutateAsync({
          id: editingId,
          ...formData,
          isPublished: true,
        });
        toast.success('Content updated successfully');
      } else {
        await createContentMutation.mutateAsync({
          type: contentType,
          ...formData,
          isPublished: true,
        });
        toast.success('Content created successfully');
      }

      setFormData({ title: '', description: '', content: '', author: '', authorCompany: '' });
      setEditingId(null);
      contentQuery.refetch();
    } catch (error) {
      toast.error('Error saving content');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      content: item.content || '',
      author: item.author || '',
      authorCompany: item.authorCompany || '',
    });
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
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Leads Management
          </button>
          <button
            onClick={() => navigateTo('/admin/cms')}
            className="w-full text-left px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
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
          <h1 className="text-2xl font-bold text-foreground">CMS Editor</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <Card className="p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {editingId ? 'Edit Content' : 'Add New Content'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Content Type</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="testimonial">Testimonial</option>
                      <option value="case_study">Case Study</option>
                      <option value="service">Service</option>
                      <option value="page_section">Page Section</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Content title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Short description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full content"
                      rows={4}
                    />
                  </div>

                  {(contentType === 'testimonial' || contentType === 'case_study') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Author Name</label>
                        <Input
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          placeholder="Author name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Author Company</label>
                        <Input
                          value={formData.authorCompany}
                          onChange={(e) => setFormData({ ...formData, authorCompany: e.target.value })}
                          placeholder="Company name"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-primary hover:bg-accent text-white">
                      <Save size={18} className="mr-2" />
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ title: '', description: '', content: '', author: '', authorCompany: '' });
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            </div>

            {/* Content List */}
            <div className="lg:col-span-2">
              <Card className="p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {contentType.replace('_', ' ').toUpperCase()} List
                </h2>

                {contentQuery.isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : contentQuery.data && contentQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {contentQuery.data.map((item) => (
                      <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 hover:bg-muted rounded transition-colors text-primary"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                        {item.author && (
                          <p className="text-xs text-muted-foreground">
                            By {item.author} {item.authorCompany ? `at ${item.authorCompany}` : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No content yet. Create your first {contentType.replace('_', '')}!</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
