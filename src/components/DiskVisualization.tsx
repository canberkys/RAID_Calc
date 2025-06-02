import React from 'react';
import { HardDrive } from 'lucide-react';
import { RaidLevel } from '../types';
import { formatCapacitySimple } from '../utils/formatters';
import Tooltip from './Tooltip';

interface DiskVisualizationProps {
  diskCount: number;
  raidLevel: RaidLevel;
  diskCapacity: number;
}

const DiskVisualization: React.FC<DiskVisualizationProps> = ({ 
  diskCount, 
  raidLevel,
  diskCapacity
}) => {
  const getProtectedDisks = () => {
    switch (raidLevel) {
      case 'RAID 0': return 0;
      case 'RAID 1': return Math.floor(diskCount / 2);
      case 'RAID 5': return 1;
      case 'RAID 6': return 2;
      case 'RAID 10': return Math.floor(diskCount / 2);
      default: return 0;
    }
  };

  const protectedDisks = getProtectedDisks();
  const dataDisks = diskCount - protectedDisks;
  
  const disks = Array.from({ length: diskCount }).map((_, index) => {
    const isProtected = index >= diskCount - protectedDisks;
    const type = isProtected
      ? (raidLevel === 'RAID 1' || raidLevel === 'RAID 10' ? 'Ayna' : 'Parity')
      : 'Veri';
    const colorClass = isProtected ? 'text-blue-600' : 'text-green-600';

    return {
      id: `disk-${index}`,
      type: type,
      capacity: formatCapacitySimple(diskCapacity),
      colorClass: colorClass,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {disks.map(disk => (
          <Tooltip key={disk.id} content={`${disk.type} Disk: ${disk.capacity}`}>
            <div
              className="relative group"
            >
              <HardDrive
                size={24}
                className={`${disk.colorClass}`}
              />
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="flex space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
          <span className="text-slate-600 dark:text-slate-400">Veri Diskleri ({dataDisks})</span>
        </div>
        {protectedDisks > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">{raidLevel === 'RAID 1' || raidLevel === 'RAID 10' ? 'Ayna' : 'Parity'} Diskleri ({protectedDisks})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiskVisualization