"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function AIPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="AI-Powered Tools"
        description="Leverage the power of artificial intelligence to enhance your server moderation and management."
        icon={Bot}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Anti-Scam Filter</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Our AI actively scans messages for phishing links, scam patterns, and malicious content, automatically deleting them and warning the user.
            </p>
            <Button variant="outline" disabled>Enabled by Default</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Chat Summarization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Use the `/ai summarize` command in any channel to get a quick, AI-generated summary of the recent conversation. Perfect for catching up.
            </p>
            <Button variant="outline">Learn Command</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>More Tools Coming Soon</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              We're constantly developing new AI features, including automated ticket categorization, sentiment analysis, and proactive moderation suggestions.
            </p>
            <Button variant="secondary" disabled>Stay Tuned</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
