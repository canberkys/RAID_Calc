import React from 'react';
import { HardDrive } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-navy-800 shadow-soft">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-navy-700 dark:text-white">
              RAID Capacity Calculator
            </h1>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            v1.0.0
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;