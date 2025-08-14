"use client";

import { useState, useEffect } from 'react';
import { Backup } from '@/entities/Backup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database, Plus, Download, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import PageHeader from '@/components/PageHeader';
import useAppLevelAuth from '@/hooks/useAppLevelAuth';

export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { isLoggedIn } = useAppLevelAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadBackups();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const data = await Backup.list("createdAt:desc");
      setBackups(data);
    } catch (error) {
      console.error("Failed to load backups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      const newBackupData = {
        name: `Backup ${format(new Date(), 'yyyy-MM-dd-HH-mm')}`,
        description: 'Manual backup created from dashboard',
        serverId: 'server-01', // Placeholder
        backupId: `bkp-${Date.now()}`,
        status: 'creating',
      };
      const created = await Backup.create(newBackupData);
      setBackups([created, ...backups]);
      
      // Simulate backup process
      setTimeout(async () => {
        await Backup.update(created.id, { status: 'completed', size: `${(Math.random() * 50 + 10).toFixed(2)} MB` });
        loadBackups();
      }, 5000);

    } catch (error) {
      console.error("Failed to create backup:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'creating':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Creating</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'restoring':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Restoring</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Server Backups"
        description="Create, manage, and restore backups of your server's configuration, roles, and channels."
        icon={Database}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>A log of all created backups for your servers.</CardDescription>
          </div>
          <Button onClick={handleCreateBackup} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create New Backup
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 w-40 bg-slate-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-32 bg-slate-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-16 bg-slate-200 rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-24 bg-slate-200 rounded-full"></div></TableCell>
                    <TableCell className="text-right"><div className="h-8 w-20 bg-slate-200 rounded-lg ml-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : backups.length > 0 ? backups.map(backup => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.name}</TableCell>
                  <TableCell>{format(new Date(backup.createdAt), 'MMM d, yyyy, h:mm a')}</TableCell>
                  <TableCell>{backup.size || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(backup.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" disabled={backup.status !== 'completed'}>
                      <Download className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No backups found. Create your first one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
