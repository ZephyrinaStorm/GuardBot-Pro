"use client";

import { useState, useEffect } from 'react';
import { ProtectionConfig } from '@/entities/ProtectionConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Link2Off, Bot, UserX, MessageCircle, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import useAppLevelAuth from '@/hooks/useAppLevelAuth';
import { useToast } from '@/components/ui/use-toast';

const protectionFeatures = [
  { id: 'antiRaid', label: 'Anti-Raid', description: 'Automatically locks down the server during a suspected raid.', icon: ShieldAlert },
  { id: 'antiNuke', label: 'Anti-Nuke', description: 'Prevents rapid deletion of channels and roles.', icon: ShieldCheck },
  { id: 'antiLink', label: 'Anti-Link', description: 'Deletes messages containing unauthorized links.', icon: Link2Off },
  { id: 'antiSpam', label: 'Anti-Spam', description: 'Mutes users who send messages too quickly.', icon: MessageCircle },
  { id: 'antiScam', label: 'Anti-Scam', description: 'AI-powered filter to detect and remove scam links.', icon: Bot },
  { id: 'antiAlt', label: 'Anti-Alt', description: 'Flags or kicks accounts that are suspected alts.', icon: UserX },
];

export default function ProtectionPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isLoggedIn } = useAppLevelAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      loadConfig();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      // In a real app, you'd filter by serverId
      const configs = await ProtectionConfig.list();
      if (configs.length > 0) {
        setConfig(configs[0]);
      } else {
        // Create a default config if none exists
        const defaultConfig = await ProtectionConfig.create({ serverId: 'server-01' });
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error("Failed to load protection config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (featureId: string, value: boolean) => {
    setConfig((prev: any) => ({ ...prev, [featureId]: value }));
  };

  const handleSaveChanges = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      await ProtectionConfig.update(config.id, config);
      toast({
        title: "Settings Saved",
        description: "Your protection settings have been updated successfully.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-start gap-6 mb-8">
          <div className="h-14 w-14 rounded-xl bg-slate-200"></div>
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-96 bg-slate-200 rounded-md mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Server Protection"
        description="Configure automated protection modules to safeguard your server from threats."
        icon={Shield}
      />

      <Card>
        <CardHeader>
          <CardTitle>Protection Modules</CardTitle>
          <CardDescription>Toggle modules on or off for your server.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {protectionFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <Label htmlFor={feature.id} className="font-semibold text-base">{feature.label}</Label>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  id={feature.id}
                  checked={config?.[feature.id] || false}
                  onCheckedChange={(value) => handleToggle(feature.id, value)}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
