import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-navy-800 border-t border-slate-200 dark:border-navy-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} RAID Capacity Calculator
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              A tool for calculating storage capacity across different RAID configurations
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/raid-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;