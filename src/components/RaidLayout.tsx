import React from 'react';
import { RaidLevel } from '../types';

interface RaidLayoutProps {
  raidLevel: RaidLevel;
  diskCount: number;
  diskCapacity: number;
}

const RaidLayout: React.FC<RaidLayoutProps> = ({ raidLevel, diskCount }) => {
  const getStripePattern = () => {
    const pattern = [];
    const stripeSize = 
      raidLevel === 'RAID 0' ? diskCount :
      raidLevel === 'RAID 1' ? 2 :
      raidLevel === 'RAID 5' ? diskCount :
      raidLevel === 'RAID 6' ? diskCount :
      raidLevel === 'RAID 10' ? 2 : diskCount;

    for (let i = 0; i < Math.min(diskCount, 4); i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        if (raidLevel === 'RAID 1' || raidLevel === 'RAID 10') {
          row.push(Math.floor(j / 2));
        } else if (raidLevel === 'RAID 5') {
          row.push((j + i) % stripeSize === stripeSize - 1 ? 'P' : j);
        } else if (raidLevel === 'RAID 6') {
          row.push((j + i) % stripeSize >= stripeSize - 2 ? 'P' : j);
        } else {
          row.push(j);
        }
      }
      pattern.push(row);
    }
    return pattern;
  };

  return (
    <div className="bg-slate-50 p-5 rounded-lg dark:bg-navy-800">
      <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-4">RAID Layout</h3>
      <div className="grid gap-2">
        {getStripePattern().map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`w-12 h-12 rounded-md flex items-center justify-center font-mono text-sm
                  ${cell === 'P' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}
              >
                {cell === 'P' ? 'P' : `D${cell}`}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>Data Blocks</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>Parity/Mirror Blocks</span>
        </div>
      </div>
    </div>
  );
};

export default RaidLayout;