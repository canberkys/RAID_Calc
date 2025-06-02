import React, { useState, useEffect } from 'react';
import { formatCapacitySimple, formatCapacityBinary } from '../utils/formatters';
import { HardDrive } from 'lucide-react';

interface CapacityBarProps {
  totalCapacity: number;
  usableCapacity: number;
  protectionCapacity: number;
}

const CapacityBar: React.FC<CapacityBarProps> = ({
  totalCapacity,
  usableCapacity,
  protectionCapacity
}) => {
  const [animateUsable, setAnimateUsable] = useState(0);
  const [animateProtection, setAnimateProtection] = useState(0);
  const [animateReserved, setAnimateReserved] = useState(0);

  // Geçici olarak %1 reserved alan ekleniyor (görseldeki gibi)
  const reservedCapacity = totalCapacity * 0.01;

  const usablePercent = (usableCapacity / totalCapacity) * 100;
  const protectionPercent = (protectionCapacity / totalCapacity) * 100;
  const reservedPercent = (reservedCapacity / totalCapacity) * 100;
  const totalAllocatedPercent = usablePercent + protectionPercent + reservedPercent;

  // Boş alan hesaplaması (varsa)
  const unusedCapacity = totalCapacity - usableCapacity - protectionCapacity - reservedCapacity;
  const unusedPercent = (unusedCapacity / totalCapacity) * 100;

  useEffect(() => {
    setAnimateUsable(0);
    setAnimateProtection(0);
    setAnimateReserved(0);

    const timerReserved = setTimeout(() => {
      setAnimateReserved(reservedPercent);
    }, 100);

    const timerUsable = setTimeout(() => {
      setAnimateUsable(usablePercent);
    }, 300);

    const timerProtection = setTimeout(() => {
      setAnimateProtection(protectionPercent);
    }, 600);

    return () => {
      clearTimeout(timerReserved);
      clearTimeout(timerUsable);
      clearTimeout(timerProtection);
    };
  }, [usablePercent, protectionPercent, reservedPercent]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
        <span>0 GiB</span>
        <span>{formatCapacityBinary(totalCapacity)}</span>
      </div>

      <div className="h-8 w-full bg-slate-300 dark:bg-navy-700 rounded-md overflow-hidden relative flex">
        {/* Reserved Capacity */}
        <div
          className="h-full bg-orange-500 transition-all duration-1000 ease-out flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${animateReserved}%` }}
        >
          {animateReserved > 5 && <span>{formatCapacityBinary(reservedCapacity).split(' (')[0]}</span>} {/* Show text if bar is wide enough */}
        </div>

        {/* Usable Capacity */}
        <div
          className="h-full bg-green-500 transition-all duration-1000 ease-out flex items-center justify-center text-white text-xs font-bold"
          style={{
            width: `${animateUsable}%`,
          }}
        >
           {animateUsable > 5 && <span>{formatCapacityBinary(usableCapacity).split(' (')[0]}</span>}
        </div>

        {/* Protection Capacity */}
        <div
          className="h-full bg-blue-500 transition-all duration-1000 ease-out flex items-center justify-center text-white text-xs font-bold"
          style={{
            width: `${animateProtection}%`,
          }}
        >
           {animateProtection > 5 && <span>{formatCapacityBinary(protectionCapacity).split(' (')[0]}</span>}
        </div>

         {/* Unused Space (if any) */}
         {unusedPercent > 0 && (
            <div
              className="h-full bg-gray-400 transition-all duration-1000 ease-out"
              style={{
                width: `${unusedPercent}%`,
              }}
            ></div>
         )}

      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
          <span className="text-slate-600 dark:text-slate-400">System Reserved ({formatCapacityBinary(reservedCapacity)})</span>
           <HardDrive size={16} className="text-orange-500"/>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-slate-600 dark:text-slate-400">Usable Capacity ({formatCapacityBinary(usableCapacity)})</span>
           <HardDrive size={16} className="text-green-500"/>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="text-slate-600 dark:text-slate-400">Used for Protection ({formatCapacityBinary(protectionCapacity)})</span>
           <HardDrive size={16} className="text-blue-500"/>
        </div>

        {unusedPercent > 0 && (
           <div className="flex items-center space-x-2">
             <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
             <span className="text-slate-600 dark:text-slate-400">Unused Space ({formatCapacityBinary(unusedCapacity)})</span>
              <HardDrive size={16} className="text-gray-400"/>
           </div>
        )}
      </div>
    </div>
  );
};

export default CapacityBar;