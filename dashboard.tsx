"use client";

import { useState, useEffect } from "react";
import { Server } from "@/entities/Server";
import { ModerationCase } from "@/entities/ModerationCase";
import { Ticket } from "@/entities/Ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Gavel, Ticket as TicketIcon, Activity, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react";
import useAppLevelAuth from "@/hooks/useAppLevelAuth";
import Link from "next/link";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const { isLoggedIn } = useAppLevelAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [activeTickets, setActiveTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadDashboardData();
  }, [isLoggedIn]);

   const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [serversData, casesData, allRecentTickets] = await Promise.all([
        Server.list("createdAt:desc", 10),
        ModerationCase.list("createdAt:desc", 5),
        Ticket.list("createdAt:desc", 20) // Fetch recent tickets to filter client-side
      ]);
      
      const activeTicketsData = allRecentTickets
        .filter(ticket => ticket.status === 'open' || ticket.status === 'in_progress')
        .slice(0, 5);

      setServers(serversData);
      setRecentCases(casesData);
      setActiveTickets(activeTicketsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (false);
    }
  };

  if (!isLoggedIn) return null;

  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.botStatus === 'online').length;
  const totalCases = recentCases.length;
  const totalTickets = activeTickets.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600">Monitor your Discord servers and bot activity</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600">Monitor your Discord servers and bot activity</p>
        </div>
        <div className="flex gap-3">
          <Link href={createPageUrl('Protection')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Shield className="h-4 w-4 mr-2" />
              Configure Protection
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Servers</p>
                <p className="text-3xl font-bold text-blue-900">{totalServers}</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Online Servers</p>
                <p className="text-3xl font-bold text-green-900">{onlineServers}</p>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Recent Cases</p>
                <p className="text-3xl font-bold text-orange-900">{totalCases}</p>
              </div>
              <div className="p-3 bg-orange-600 rounded-lg">
                <Gavel className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Tickets</p>
                <p className="text-3xl font-bold text-purple-900">{totalTickets}</p>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <TicketIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No servers configured yet</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Server
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {servers.slice(0, 5).map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{server.serverName}</p>
                      <p className="text-sm text-slate-500">{server.memberCount} members</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={server.botStatus === 'online' ? 'default' : 'secondary'}
                        className={server.botStatus === 'online' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {server.botStatus}
                      </Badge>
                      <Badge variant="outline">{server.premiumTier}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCases.length === 0 && activeTickets.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCases.slice(0, 3).map((case_) => (
                  <div key={case_.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Gavel className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">
                        {case_.action} - {case_.username}
                      </p>
                      <p className="text-sm text-slate-500">{case_.reason}</p>
                    </div>
                    <Badge variant="outline">{case_.status}</Badge>
                  </div>
                ))}
                {activeTickets.slice(0, 2).map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TicketIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{ticket.subject}</p>
                      <p className="text-sm text-slate-500">by {ticket.username}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        ticket.priority === 'urgent' ? 'border-red-200 text-red-700' :
                        ticket.priority === 'high' ? 'border-orange-200 text-orange-700' :
                        'border-slate-200 text-slate-700'
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href={createPageUrl('Protection')}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Configure Protection</span>
              </Button>
            </Link>
            <Link href={createPageUrl('Moderation')}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Gavel className="h-6 w-6 text-orange-600" />
                <span>View Mod Cases</span>
              </Button>
            </Link>
            <Link href={createPageUrl('Blacklist')}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span>Manage Blacklist</span>
              </Button>
            </Link>
            <Link href={createPageUrl('Tickets')}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <TicketIcon className="h-6 w-6 text-purple-600" />
                <span>Support Tickets</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
