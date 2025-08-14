"use client";

import { useState, useEffect } from 'react';
import { ModerationCase } from '@/entities/ModerationCase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Gavel, User, Clock, Shield, Search } from 'lucide-react';
import { format } from 'date-fns';
import PageHeader from '@/components/PageHeader';
import useAppLevelAuth from '@/hooks/useAppLevelAuth';

export default function Moderation() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoggedIn } = useAppLevelAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadCases();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadCases = async () => {
    setLoading(true);
    try {
      const casesData = await ModerationCase.list("createdAt:desc");
      setCases(casesData);
    } catch (error) {
      console.error("Failed to load moderation cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'ban':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">{action}</Badge>;
      case 'kick':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">{action}</Badge>;
      case 'mute':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">{action}</Badge>;
      case 'warn':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">{action}</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const filteredCases = cases.filter(c => 
    c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.moderatorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-slate-100 rounded-lg animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-3 w-48 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Moderation Log"
        description="Review all moderation actions taken across your servers. Search for users, moderators, or reasons."
        icon={Gavel}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Case History</CardTitle>
          <CardDescription>A detailed log of all moderation cases.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by user, moderator, or reason..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? renderSkeleton() : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Moderator</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length > 0 ? filteredCases.map(case_ => (
                  <TableRow key={case_.id}>
                    <TableCell className="font-medium">{case_.username}</TableCell>
                    <TableCell>{getActionBadge(case_.action)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={case_.reason}>{case_.reason}</TableCell>
                    <TableCell>{case_.moderatorName}</TableCell>
                    <TableCell>{format(new Date(case_.createdAt), 'MMM d, yyyy, h:mm a')}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No moderation cases found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
