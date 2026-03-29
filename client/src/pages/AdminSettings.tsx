import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Menu, X, Save, Eye, EyeOff } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    deepseekApiKey: '',
    notificationEmail: '',
    siteName: 'ViyonaDigital',
    enableEmailNotifications: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const settingsQuery = trpc.settings.getAll.useQuery(undefined);
  const setSettingMutation = trpc.settings.set.useMutation();

  useEffect(() => {
    if (settingsQuery.data) {
      const settingsMap = settingsQuery.data.reduce((acc, s) => {
        acc[s.key] = s.value || '';
        return acc;
      }, {} as Record<string, string>);

      setSettings(prev => ({
        ...prev,
        deepseekApiKey: (settingsMap['deepseekApiKey'] || '') as string,
        notificationEmail: (settingsMap['notificationEmail'] || '') as string,
        siteName: (settingsMap['siteName'] || 'ViyonaDigital') as string,
        enableEmailNotifications: (settingsMap['enableEmailNotifications'] === 'true') as boolean,
      }));
    }
  }, [settingsQuery.data]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        setSettingMutation.mutateAsync({
          key: 'deepseekApiKey',
          value: settings.deepseekApiKey,
          type: 'string',
        }),
        setSettingMutation.mutateAsync({
          key: 'notificationEmail',
          value: settings.notificationEmail,
          type: 'string',
        }),
        setSettingMutation.mutateAsync({
          key: 'siteName',
          value: settings.siteName,
          type: 'string',
        }),
        setSettingMutation.mutateAsync({
          key: 'enableEmailNotifications',
          value: settings.enableEmailNotifications.toString(),
          type: 'boolean',
        }),
      ]);
      toast.success('Settings saved successfully');
      settingsQuery.refetch();
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setIsLoading(false);
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
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            CMS Editor
          </button>
          <button
            onClick={() => navigateTo('/admin/settings')}
            className="w-full text-left px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
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
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-2xl">
            {/* Site Settings */}
            <Card className="p-6 border border-border mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Site Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Site name"
                  />
                </div>
              </div>
            </Card>

            {/* DeepSeek API Settings */}
            <Card className="p-6 border border-border mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">DeepSeek API Configuration</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Configure your DeepSeek API key to enable AI-powered chatbot responses. Leave blank to use fallback responses.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.deepseekApiKey}
                      onChange={(e) => setSettings({ ...settings, deepseekApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your API key from <a href="https://deepseek.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">deepseek.com</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="p-6 border border-border mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Notification Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notification Email</label>
                  <Input
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Receive email notifications for new leads and demo requests
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    checked={settings.enableEmailNotifications}
                    onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <label htmlFor="enableNotifications" className="text-sm font-medium text-foreground cursor-pointer">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </Card>

            {/* Chatbot Settings */}
            <Card className="p-6 border border-border mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Chatbot Behavior</h2>
              <p className="text-muted-foreground text-sm mb-4">
                The chatbot will automatically use your DeepSeek API key if configured. Without it, fallback responses will be used.
              </p>

              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <strong>Current Status:</strong> {settings.deepseekApiKey ? '✓ DeepSeek API Configured' : '⚠ Using Fallback Responses'}
                </p>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-primary hover:bg-accent text-white"
              >
                <Save size={18} className="mr-2" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
