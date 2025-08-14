import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon: Icon }) => {
  return (
}
    <div className="flex items-start gap-6 mb-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg flex-shrink-0">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-600 mt-1 max-w-2xl">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;
