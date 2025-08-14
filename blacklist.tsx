"use client";

import { useState, useEffect } from 'react';
import { Blacklist } from '@/entities/Blacklist';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ban, Plus, Trash2, UserX, FileWarning, Link2Off } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import useAppLevelAuth from '@/hooks/useAppLevelAuth';

export default function BlacklistPage() {
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ type: 'word', value: '', reason: '' });
  const { isLoggedIn } = useAppLevelAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadBlacklist();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadBlacklist = async () => {
    setLoading(true);
    try {
      const data = await Blacklist.list("createdAt:desc");
      setBlacklist(data);
    } catch (error) {
      console.error("Failed to load blacklist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.value.trim()) return;
    try {
      // In a real app, you'd also pass serverId and addedBy
      const createdItem = await Blacklist.create({ ...newItem, serverId: 'global', addedBy: 'Admin' });
      setBlacklist([createdItem, ...blacklist]);
      setNewItem({ type: newItem.type, value: '', reason: '' });
    } catch (error) {
      console.error("Failed to add to blacklist:", error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await Blacklist.delete(id);
      setBlacklist(blacklist.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to remove from blacklist:", error);
    }
  };

  const renderBlacklistTable = (type: 'word' | 'user' | 'domain') => {
    const filteredItems = blacklist.filter(item => item.type === type);
    
    if (loading) {
      return (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.value}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>{item.addedBy}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No items in this blacklist.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Server Blacklist"
        description="Manage blacklisted words, users, and domains to keep your community safe and clean."
        icon={Ban}
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add to Blacklist</CardTitle>
          <CardDescription>Add a new entry to one of the blacklists.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Value (e.g., a bad word, user ID, domain.com)"
              value={newItem.value}
              onChange={(e) => setNewItem({...newItem, value: e.target.value})}
              className="flex-grow"
            />
            <Input 
              placeholder="Reason (optional)"
              value={newItem.reason}
              onChange={(e) => setNewItem({...newItem, reason: e.target.value})}
              className="flex-grow"
            />
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="word" onValueChange={(v) => setNewItem({...newItem, type: v})}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="word"><FileWarning className="h-4 w-4 mr-2" />Words</TabsTrigger>
          <TabsTrigger value="user"><UserX className="h-4 w-4 mr-2" />Users</TabsTrigger>
          <TabsTrigger value="domain"><Link2Off className="h-4 w-4 mr-2" />Domains</TabsTrigger>
        </TabsList>
        <TabsContent value="word">
          <Card>
            <CardHeader>
              <CardTitle>Blacklisted Words</CardTitle>
              <CardDescription>Messages containing these words will be automatically deleted.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBlacklistTable('word')}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>Blacklisted Users</CardTitle>
              <CardDescription>These users will be prevented from joining or will be banned upon joining.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBlacklistTable('user')}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>Blacklisted Domains</CardTitle>
              <CardDescription>Links containing these domains will be automatically deleted.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBlacklistTable('domain')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
