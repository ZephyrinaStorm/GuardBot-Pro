"use client";

import { useState, useEffect } from 'react';
import { Ticket } from '@/entities/Ticket';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket as TicketIcon, User, Clock, AlertCircle, CheckCircle, Hourglass } from 'lucide-react';
import { format } from 'date-fns';
import PageHeader from '@/components/PageHeader';
import useAppLevelAuth from '@/hooks/useAppLevelAuth';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAppLevelAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadTickets();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await Ticket.list("createdAt:desc");
      setTickets(data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'waiting':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Waiting</Badge>;
      case 'closed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Hourglass className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Support Tickets"
        description="Manage all user-submitted support tickets. Respond, assign, and resolve issues efficiently."
        icon={TicketIcon}
      />

      <Card>
        <CardHeader>
          <CardTitle>Ticket Queue</CardTitle>
          <CardDescription>A list of all support tickets from your servers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-6 w-6 rounded-full bg-slate-200"></div></TableCell>
                    <TableCell><div className="h-4 w-48 bg-slate-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-slate-200 rounded"></div></TableCell>
                    <TableCell><div className="h-6 w-20 bg-slate-200 rounded-full"></div></TableCell>
                    <TableCell><div className="h-4 w-32 bg-slate-200 rounded"></div></TableCell>
                    <TableCell className="text-right"><div className="h-8 w-20 bg-slate-200 rounded-lg ml-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : tickets.length > 0 ? tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{getPriorityIcon(ticket.priority)}</TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>{ticket.username}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Ticket</Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No tickets found.
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
