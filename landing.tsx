"use client";

import React from 'react';
import { Shield, Bot, Gavel, Database, Zap } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
    <div className="inline-block bg-blue-600 text-white p-4 rounded-full mb-4">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="relative isolate overflow-hidden">
        {/* Background Gradients */}
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-slate-700 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-4224-a64e-1058d4fdd544"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-4224-a64e-1058d4fdd544)" />
        </svg>
        <div
          className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#4f46e5] to-[#1d4ed8] opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64.3%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 1.4% 98.2%, 8.2% 91.8%, 7.2% 75.1%, 22.1% 52.6%, 62.8% 51.8%)',
            }}
          />
        </div>

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">GuardBot Pro</span>
              </a>
            </div>
            <div className="lg:flex lg:flex-1 lg:justify-end">
              <Link href={createPageUrl('login')}>
                <Button variant="ghost" className="text-white hover:bg-slate-800">
                  Log in <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-32 pb-24 sm:pt-48 sm:pb-32">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-center sm:text-6xl">
                The Ultimate Protection for Your Discord Server
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 text-center">
                GuardBot Pro offers a comprehensive suite of tools to protect, moderate, and manage your community with cutting-edge AI and robust automation.
              </p>
              <div className="mt-8 flex gap-x-4 justify-center">
                <Link href={createPageUrl('signup')}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href={createPageUrl('Dashboard')}>
                   <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 hover:text-white">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-400">Total Security</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to secure your community
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              From automated raid prevention to AI-powered scam detection, GuardBot Pro is your server's first line of defense.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <FeatureCard 
                icon={Shield}
                title="Advanced Protection"
                description="Multi-layered defense against raids, nukes, spam, and malicious links."
              />
              <FeatureCard 
                icon={Gavel}
                title="Effortless Moderation"
                description="Powerful, easy-to-use moderation commands and a comprehensive case log."
              />
              <FeatureCard 
                icon={Bot}
                title="AI-Powered Tools"
                description="Leverage AI for scam detection, chat summarization, and more."
              />
              <FeatureCard 
                icon={Database}
                title="Server Backups"
                description="Create and restore complete backups of your server's roles and channels."
              />
              <FeatureCard 
                icon={Zap}
                title="Full Automation"
                description="Set up automated actions for blacklisted words, spam, and other infractions."
              />
              <FeatureCard 
                icon={Zap}
                title="Ticket System"
                description="A complete support ticket system to manage user inquiries efficiently."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
