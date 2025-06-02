import React from 'react';
import { HardDrive } from 'lucide-react';
import { formatCapacitySimple } from '../utils/formatters';

interface DiskCapacitySelectorProps {
  diskCapacity: number;
  setDiskCapacity: (capacity: number) => void;
  diskCount: number;
}

const capacityOptions = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const DiskCapacitySelector: React.FC<DiskCapacitySelectorProps> = ({
  diskCapacity,
  setDiskCapacity,
  diskCount,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-3">Disk Kapasitesi</h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {capacityOptions.map((capacity) => (
          <button
            key={capacity}
            onClick={() => setDiskCapacity(capacity)}
            className={`btn ${
              diskCapacity === capacity ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {capacity} TB
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-base font-semibold text-navy-700 dark:text-white mb-3">Diskler</h4>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: diskCount }).map((_, index) => (
            <div key={index} className="relative group">
              <div className="w-20 h-24 bg-slate-300 dark:bg-navy-700 rounded-lg flex flex-col items-center justify-center p-2 border border-slate-400 dark:border-navy-600 shadow-sm">
                <HardDrive size={32} className="text-navy-700 dark:text-slate-300 mb-1" />
                <span className="text-sm font-semibold text-navy-700 dark:text-slate-300">{diskCapacity} TB</span>
              </div>
            </div>
          ))}
          {Array.from({ length: 24 - diskCount }).map((_, index) => (
            <div key={`empty-${index}`} className="w-20 h-24 border-2 border-dashed border-slate-300 dark:border-navy-700 rounded-lg flex items-center justify-center text-slate-400 dark:text-navy-600 text-sm">
               Boş
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiskCapacitySelector;