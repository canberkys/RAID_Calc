import React from 'react';
import { InfoIcon } from 'lucide-react';
import { RaidLevel } from '../types';
import Tooltip from './Tooltip';

interface RaidSelectorProps {
  raidLevel: RaidLevel;
  setRaidLevel: (level: RaidLevel) => void;
  diskCount: number;
}

const RaidSelector: React.FC<RaidSelectorProps> = ({ raidLevel, setRaidLevel, diskCount }) => {
  const raidOptions: {
    level: RaidLevel;
    minDisks: number;
    description: string;
  }[] = [
    { 
      level: 'RAID 0', 
      minDisks: 2, 
      description: 'Striping without redundancy. All disk capacity is used for storage. No fault tolerance.'
    },
    { 
      level: 'RAID 1', 
      minDisks: 2, 
      description: 'Mirroring. Data is duplicated across disks. Can survive failure of half the disks.'
    },
    { 
      level: 'RAID 5', 
      minDisks: 3, 
      description: 'Striping with distributed parity. Can survive failure of one disk.'
    },
    { 
      level: 'RAID 6', 
      minDisks: 4, 
      description: 'Striping with double distributed parity. Can survive failure of two disks.'
    },
    { 
      level: 'RAID 10', 
      minDisks: 4, 
      description: 'Combination of RAID 1 and RAID 0. Can survive failure of one disk in each mirrored pair.'
    },
  ];

  return (
    <div className="bg-slate-50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-navy-700 mb-4">RAID Configuration</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {raidOptions.map(option => {
          const isDisabled = diskCount < option.minDisks;
          const isSelected = raidLevel === option.level;
          
          return (
            <div key={option.level} className="relative">
              <button
                onClick={() => !isDisabled && setRaidLevel(option.level)}
                disabled={isDisabled}
                className={`w-full p-3 rounded-md border transition-all duration-300 ${
                  isDisabled 
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                    : isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500 ring-opacity-50' 
                      : 'bg-white border-slate-300 text-navy-700 hover:border-blue-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.level}</span>
                  <Tooltip content={option.description}>
                    <InfoIcon size={16} className="text-slate-500" />
                  </Tooltip>
                </div>
                
                {isDisabled && (
                  <div className="text-xs mt-1 text-red-500">
                    Requires {option.minDisks}+ disks
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaidSelector;