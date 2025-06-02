import React from 'react';
// Plus, Minus ikonları artık kullanılmayacak
// import { Plus, Minus } from 'lucide-react';
// DiskVisualization artık burada değil
// import DiskVisualization from './DiskVisualization';
import { RaidLevel } from '../types';

interface DiskCountSelectorProps {
  diskCount: number;
  setDiskCount: (count: number) => void;
  raidLevel: RaidLevel; // RAID seviyesi hala minimum disk sayısı için gerekli
}

const DiskCountSelector: React.FC<DiskCountSelectorProps> = ({
  diskCount,
  setDiskCount,
  raidLevel,
}) => {
  const MIN_DISKS = raidLevel === 'RAID 5' ? 3 :
                    raidLevel === 'RAID 6' ? 4 :
                    raidLevel === 'RAID 10' ? 4 : 2;
  const MAX_DISKS = 24;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= MIN_DISKS && newValue <= MAX_DISKS) {
      // RAID 10 için çift sayı kontrolü
      if (raidLevel === 'RAID 10') {
        if (newValue >= MIN_DISKS && newValue % 2 === 0) {
           setDiskCount(newValue);
        } else if (newValue > MIN_DISKS && newValue % 2 !== 0 && newValue - 1 >= MIN_DISKS) {
           // Eğer girilen tek sayı ve minimumdan büyükse, bir düşüğünü (çift) ayarla
           setDiskCount(newValue - 1);
        } else if (newValue < MIN_DISKS && MIN_DISKS % 2 === 0) {
           // Eğer minimumdan küçük ve minimum çiftse, minimumu ayarla
           setDiskCount(MIN_DISKS);
        } else if (newValue < MIN_DISKS && MIN_DISKS % 2 !== 0 && MIN_DISKS + 1 <= MAX_DISKS) {
           // Eğer minimumdan küçük, minimum tek ve minimum+1 maxdan küçükse, minimum+1 i ayarla
            setDiskCount(MIN_DISKS + 1);
        }

      } else {
        setDiskCount(newValue);
      }
    } else if (e.target.value === '') {
        // Input boşaldığında değeri 0 yap veya başka bir başlangıç değeri ata
        // setDiskCount(0); // Ya da başka bir varsayılan değer
    } else if (!isNaN(newValue) && newValue < MIN_DISKS && diskCount !== MIN_DISKS) {
        // Minimumdan küçük ama geçerli bir sayı girildiğinde minimuma ayarla
         setDiskCount(MIN_DISKS);
    } else if (!isNaN(newValue) && newValue > MAX_DISKS && diskCount !== MAX_DISKS) {
        // Maximumdan büyük ama geçerli bir sayı girildiğinde maximuma ayarla
        setDiskCount(MAX_DISKS);
    }
  };

   // Disk sayısı seçimi için basit input
  return (
    <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
             <span className="bg-slate-800 text-white text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-navy-700">Adım 1</span>
             <h3 className="text-lg font-semibold text-navy-700 dark:text-white">Diskleri Seçin</h3>
        </div>

        <div className="flex items-center gap-3">
             <label htmlFor="disk-count" className="text-slate-700 dark:text-slate-300">Toplam Disk Sayısı:</label>
             <input
                id="disk-count"
                type="number"
                min={MIN_DISKS}
                max={MAX_DISKS}
                value={diskCount}
                onChange={handleInputChange}
                className="w-20 px-3 py-2 border border-slate-300 rounded-md dark:border-navy-600 bg-white dark:bg-navy-700 text-navy-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
        </div>
         {/* Disk görselleştirmesi artık DiskCapacitySelector'da
         <div className="mt-2">
           <DiskVisualization diskCount={diskCount} raidLevel={raidLevel} diskCapacity={diskCapacity} />
         </div>
         */}
         {raidLevel === 'RAID 10' && diskCount % 2 !== 0 && (
             <p className="text-sm text-red-500 mt-2">RAID 10 için disk sayısı çift olmalıdır.</p>
         )}

    </div>
  );
};

export default DiskCountSelector;