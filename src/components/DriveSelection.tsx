import React, { useState, useEffect } from 'react';
import { RaidLevel } from '../types';
// DiskVisualization artık burada kullanılmayacak
// import DiskVisualization from './DiskVisualization';
import { formatCapacityBinary } from '../utils/formatters';
import { HardDrive, Plus, Minus, HelpCircle } from 'lucide-react'; // İkonları ekle
import Tooltip from './Tooltip'; // Tooltip bileşenini kullanacağız

interface DriveSelectionProps {
  // Bu proplar artık DriveSelection içinde yönetilmiyor, dışarıdan gelecek
  // diskCount: number; 
  // setDiskCount: (count: number) => void;
  // diskCapacity: number;
  // setDiskCapacity: (capacity: number) => void;
  raidLevel: RaidLevel;
  diskCountsByCapacity: Map<number, number>; // Parent'tan gelecek state
  setDiskCountsByCapacity: (counts: Map<number, number>) => void; // Parent state'ini güncellemek için callback
  selectedCapacity: number; // Parent'tan gelecek seçili kapasite
  setSelectedCapacity: (capacity: number) => void; // Parent state'ini güncellemek için callback
  currentTotalDiskCount: number; // Parent'tan gelecek toplam disk sayısı
}

const hddCapacityOptions = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const ssdCapacityOptions = [0.48, 0.96, 1.92, 3.84, 7]; // TB cinsinden

const MIN_DISKS = (raidLevel: RaidLevel) => raidLevel === 'RAID 5' ? 3 :
                                         raidLevel === 'RAID 6' ? 4 :
                                         raidLevel === 'RAID 10' ? 4 : 2;
const MAX_DISKS = 24; // Maksimum disk sayısı

const DriveSelection: React.FC<DriveSelectionProps> = ({
  // Propları yeniden düzenle
  raidLevel,
  diskCountsByCapacity,
  setDiskCountsByCapacity,
  selectedCapacity,
  setSelectedCapacity,
  currentTotalDiskCount,
}) => {
  const [diskType, setDiskType] = useState<'HDD' | 'SATA SSD'>('HDD');
  const [hoveredCapacity, setHoveredCapacity] = useState<number | null>(null);

   // Toplam disk sayısını diskCountsByCapacity state'inden hesapla - Artık parent'tan geliyor
  // const currentTotalDiskCount = Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0);

  // RAID seviyesine göre koruma diski sayısını hesapla
  const getProtectedDisks = (count: number, level: RaidLevel) => {
    switch (level) {
      case 'RAID 0': return 0;
      case 'RAID 1': return Math.floor(count / 2);
      case 'RAID 5': return 1;
      case 'RAID 6': return 2;
      case 'RAID 10': return Math.floor(count / 2);
      default: return 0;
    }
  };

  const protectedDisks = getProtectedDisks(currentTotalDiskCount, raidLevel);

  // Bu fonksiyon artık sadece hangi kapasitenin seçili olduğunu belirler (UI vurgusu için)
  const handleCapacitySelect = (capacity: number) => {
    setSelectedCapacity(capacity);
  };

  // Belirli bir kapasite için disk ekle
  const handleAddDisk = (capacity: number) => {
    if (currentTotalDiskCount < MAX_DISKS) {
      const currentCount = diskCountsByCapacity.get(capacity) || 0;
      const newDiskCounts = new Map(diskCountsByCapacity);
      newDiskCounts.set(capacity, currentCount + 1);

      const potentialTotal = currentTotalDiskCount + 1;
      const min = MIN_DISKS(raidLevel);

      // RAID 10 kuralı: Eğer ekleme ile toplam disk sayısı tek olacaksa, bir tane daha ekle
      if (raidLevel === 'RAID 10' && potentialTotal % 2 !== 0 && potentialTotal + 1 <= MAX_DISKS) {
         newDiskCounts.set(capacity, currentCount + 2);
      }

      setDiskCountsByCapacity(newDiskCounts); // Parent state'ini güncelle
    }
  };

  // Belirli bir kapasite için disk çıkar
  const handleRemoveDisk = (capacity: number) => {
    const currentCount = diskCountsByCapacity.get(capacity) || 0;
    const min = MIN_DISKS(raidLevel);

    if (currentCount > 0) {
      const newDiskCounts = new Map(diskCountsByCapacity);
      newDiskCounts.set(capacity, currentCount - 1);
      const potentialTotal = currentTotalDiskCount - 1;

      // RAID 10 kuralı: Eğer çıkarma ile toplam disk sayısı tek olacaksa (ve min üzerinde kalınıyorsa), bir tane daha çıkar
      if (raidLevel === 'RAID 10' && potentialTotal >= min && potentialTotal % 2 !== 0) {
           newDiskCounts.set(capacity, currentCount - 2 < 0 ? 0 : currentCount - 2); // İki tane çıkar
            const finalTotal = Array.from(newDiskCounts.values()).reduce((sum, count) => sum + count, 0);
             // Eğer iki tane çıkarmak minimumun altına düşürüyorsa, işlemi iptal et
             if (finalTotal < min && min > 0) {
                 return;
             }
      }

      const totalAfterPotentialRemove = Array.from(newDiskCounts.values()).reduce((sum, count) => sum + count, 0);

      // Çıkarma sonrası toplam minimumun altına düşüyor ve minimum 0'dan büyükse işlemi iptal et
      if (totalAfterPotentialRemove < min && min > 0) {
           return;
      }

      setDiskCountsByCapacity(newDiskCounts); // Parent state'ini güncelle
    }
  };

  // Reset fonksiyonu güncellendi - sadece disk türü değiştiğinde çalışacak
  const handleReset = () => {
    const newDiskCounts = new Map<number, number>();
    setDiskCountsByCapacity(newDiskCounts);
    setSelectedCapacity(diskType === 'HDD' ? hddCapacityOptions[0] : ssdCapacityOptions[0]); // Varsayılan kapasiteyi seçili yap (ilk seçenek)
  };

  // Disk türü değiştiğinde diskleri resetle ve varsayılan kapasiteyi ayarla
  useEffect(() => {
       handleReset();
  }, [diskType]); // diskType değiştiğinde çalışacak

  // Disk görselleştirmesi için disk listesi oluştur (farklı kapasitelerden diskleri düzleştir)
   const disks = Array.from(diskCountsByCapacity.entries()).flatMap(([capacity, count]) =>
     Array.from({ length: count }).map((_, index) => ({
       id: `disk-${capacity}-${index}`,
       capacity: capacity,
       // Her diskin RAID rolünü belirle
       isProtected: index >= count - getProtectedDisks(count, raidLevel),
     }))
   );

   // RAID rolüne göre diskleri sırala
   disks.sort((a, b) => (a.isProtected === b.isProtected ? 0 : a.isProtected ? 1 : -1));

  const displaySlotCount = Math.max(currentTotalDiskCount, 12); // Toplam disk sayısına göre yuva sayısı

   // Yuvaları oluştur (mevcut diskler ve boş yuvalar)
   const diskSlots = Array.from({ length: displaySlotCount }).map((_, index) => {
     const disk = disks[index]; // Diziden diski al
     const isPresent = !!disk; // Disk var mı?
     // Data/Parity/Mirror rengi
     const colorClass = disk?.isProtected ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400';

     const diskSizeClass = displaySlotCount > 12 ? 'w-14 h-18 md:w-16 md:h-20' : 'w-16 h-20 md:w-20 md:h-24';
     const iconSize = displaySlotCount > 12 ? 20 : 24;
     const textSizeClass = displaySlotCount > 12 ? 'text-xs' : 'text-sm';

     return (
      <div
        key={`slot-${index}`}
        className={`${diskSizeClass} rounded-lg flex flex-col items-center justify-center p-2
                   ${isPresent ? 'bg-slate-300 dark:bg-navy-700 border border-slate-400 dark:border-navy-600 shadow-sm' : 'border-2 border-dashed border-slate-300 dark:border-navy-700 text-slate-400 dark:text-navy-600 text-sm'}
                   relative group transition-all duration-200 ease-in-out`}
      >
        {isPresent ? (
          <Tooltip content={`${disk.isProtected ? (raidLevel === 'RAID 1' || raidLevel === 'RAID 10' ? 'Mirror' : 'Parity') : 'Data'} Disk: ${disk.capacity} TB`}> {/* Tooltip içeriği güncellendi */}
            <div className="flex flex-col items-center">
               <HardDrive size={iconSize} className={`${colorClass} mb-1`} />
               <span className={`${textSizeClass} font-semibold text-navy-700 dark:text-slate-300`}>{disk.capacity} TB</span>
            </div>
          </Tooltip>
        ) : (
          <span>Empty</span>
        )}
      </div>
    );
   });

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        {/* <span className="bg-slate-800 text-white text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-navy-700">Adım 1</span> */}
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">Select Drives</h3>
      </div>

      {/* Disk Türü Seçimi */}
      <div className="border-b border-slate-200 dark:border-navy-700 mb-4">
        <div className="flex text-sm font-medium text-center">
          <button
            className={`p-2 border-b-2 ${
              diskType === 'HDD' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            } focus:outline-none`}
            onClick={() => setDiskType('HDD')}
          >
            HDD
          </button>
          <button
            className={`p-2 border-b-2 ${
              diskType === 'SATA SSD' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            } focus:outline-none`}
            onClick={() => setDiskType('SATA SSD')}
          >
            SATA SSD
          </button>
        </div>
      </div>

      {/* Kapasite Seçenekleri ve Disk Sayısı Kontrolleri */}
      <div className="space-y-4">
         <h4 className="text-base font-semibold text-navy-700 dark:text-white">Capacity and Disk Count</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(diskType === 'HDD' ? hddCapacityOptions : ssdCapacityOptions).map((capacity) => {
              const currentCount = diskCountsByCapacity.get(capacity) || 0;
              const isSelected = selectedCapacity === capacity;
              return (
                <div
                  key={capacity}
                  className={`flex items-center bg-slate-100 dark:bg-navy-800 rounded-md p-2 relative group cursor-pointer
                    ${
                       isSelected ? 'border border-blue-500' : 'border border-transparent hover:border-slate-300 dark:hover:border-navy-600'
                    }
                  `}
                  onMouseEnter={() => setHoveredCapacity(capacity)}
                  onMouseLeave={() => setHoveredCapacity(null)}
                  onClick={() => handleCapacitySelect(capacity)} // Tıklanınca sadece seçili kapasiteyi ayarla
                >
                   <span className={`flex-grow text-left font-semibold px-2 py-1 transition-colors
                     ${
                       isSelected
                         ? ' text-blue-600 dark:text-blue-400'
                         : 'text-navy-700 dark:text-slate-300'
                     }
                   `}>
                     {capacity} TB
                   </span>
                   {/* Sayı ve Butonlar - Hover durumunda görünür */}
                   {(hoveredCapacity === capacity || currentCount > 0) && ( // Hover veya count > 0 ise görünür
                    <div className="flex items-center ml-auto transition-opacity duration-200 opacity-100">
                       <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveDisk(capacity); }} // İlgili kapasite için çıkar
                          disabled={currentTotalDiskCount <= MIN_DISKS(raidLevel) && currentCount > 0} // Toplam minimumun altındaysa ve bu kapasiteden varsa çıkarma disabled
                          className="w-7 h-7 flex items-center justify-center text-navy-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                          aria-label="Decrease Disk Count"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-navy-700 dark:text-slate-300 w-5 text-center text-sm">{currentCount}</span> {/* İlgili kapasitenin sayısını göster */}
                        <button
                           onClick={(e) => { e.stopPropagation(); handleAddDisk(capacity); }} // İlgili kapasite için ekle
                           disabled={currentTotalDiskCount >= MAX_DISKS}
                           className="w-7 h-7 flex items-center justify-center text-navy-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                           aria-label="Increase Disk Count"
                        >
                           <Plus size={16} />
                         </button>
                    </div>
                   )}
                </div>
             );
            })}
          </div>
           {raidLevel === 'RAID 10' && currentTotalDiskCount >= MIN_DISKS(raidLevel) && currentTotalDiskCount % 2 !== 0 && (
             <p className="text-sm text-red-500 text-center mt-2">Total disk count must be even for RAID 10.</p>
           )}
      </div>

      {/* Disk Görselleştirmesi */}
      <div className="space-y-3">
          <h4 className="text-base font-semibold text-navy-700 dark:text-white">Disk Layout</h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {diskSlots}
          </div>
          {/* Renk Açıklaması (Legend) */}
          <div className="flex justify-center items-center gap-4 text-sm text-navy-700 dark:text-slate-300">
              <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                  <span>Data Disk</span>
                  <Tooltip content="Data disks store user data directly. Depending on the RAID level, there is one or more data disks.">
                      <HelpCircle size={14} className="cursor-pointer text-slate-500 dark:text-slate-400" />
                  </Tooltip>
              </div>
               {(raidLevel === 'RAID 1' || raidLevel === 'RAID 10') && (
                 <div className="flex items-center gap-1">
                   <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                   <span>Mirror Disk</span>
                    <Tooltip content="Mirror disks keep an exact copy of the data on data disks. They provide data security but reduce usable capacity.">
                       <HelpCircle size={14} className="cursor-pointer text-slate-500 dark:text-slate-400" />
                   </Tooltip>
                 </div>
               )}
               {(raidLevel === 'RAID 5' || raidLevel === 'RAID 6') && (
                 <div className="flex items-center gap-1">
                   <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                   <span>Parity Disk</span>
                    <Tooltip content="Parity disks store parity information used to recover data from data disks. They provide fault tolerance.">
                       <HelpCircle size={14} className="cursor-pointer text-slate-500 dark:text-slate-400" />
                   </Tooltip>
                 </div>
               )}
               <div className="flex items-center gap-1">
                   <span className="w-3 h-3 border-2 border-dashed border-slate-300 dark:border-navy-700 rounded-full"></span>
                   <span>Empty Slot</span>
                    <Tooltip content="These slots represent physical disk locations not yet added to the system.">
                       <HelpCircle size={14} className="cursor-pointer text-slate-500 dark:text-slate-400" />
                   </Tooltip>
               </div>
          </div>
      </div>

      {/* Reset */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-navy-700">
        <button
          onClick={handleReset}
          className="btn btn-secondary text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DriveSelection; 