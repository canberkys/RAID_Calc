import React from 'react';
import { RaidLevel } from '../types';
// ArrowDown, ArrowUp ikonları artık kullanılmayacak
// import { ArrowDown, ArrowUp } from 'lucide-react';

interface PerformanceIndicatorProps {
  raidLevel: RaidLevel;
  diskCount: number;
}

const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({ raidLevel, diskCount }) => {
  const getPerformance = () => {
    switch (raidLevel) {
      case 'RAID 0':
        return {
          read: diskCount,
          write: diskCount,
          note: 'En yüksek performans, yedeklilik yok' // Türkçeleştir
        };
      case 'RAID 1':
        return {
          read: diskCount,
          write: 1,
          note: 'İyi okuma performansı, yazma tek diske sınırlı' // Türkçeleştir
        };
      case 'RAID 5':
        return {
          read: diskCount - 1,
          write: diskCount - 1,
          note: 'Parity yükü ile iyi genel performans' // Türkçeleştir
        };
      case 'RAID 6':
        return {
          read: diskCount - 2,
          write: diskCount - 2,
          note: 'Çift parity nedeniyle azaltılmış performans' // Türkçeleştir
        };
      case 'RAID 10':
        return {
          read: diskCount,
          write: diskCount / 2,
          note: 'Mükemmel okuma performansı, iyi yazma performansı' // Türkçeleştir
        };
      default:
        return { read: 1, write: 1, note: '' };
    }
  };

  const performance = getPerformance();

  // Performans değerlerini normalize et (maksimum disk sayısına göre)
  const maxPerformance = 24; // Varsayılan maksimum disk sayısı
  const normalizedRead = (performance.read / maxPerformance) * 100;
  const normalizedWrite = (performance.write / maxPerformance) * 100;

  return (
    <div className="bg-slate-50 p-5 rounded-lg dark:bg-navy-800 space-y-4">
      <h3 className="text-lg font-semibold text-navy-700 dark:text-white">Performans Tahmini</h3> {/* Başlık Türkçeleştir */}

      {/* Okuma Performansı */}
      <div>
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Okuma Hızı ({performance.read}x Single Disk)</div> {/* Metin Türkçeleştir */}
        <div className="w-full h-4 bg-slate-300 dark:bg-navy-700 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${normalizedRead}%` }}
          ></div>
        </div>
      </div>

      {/* Yazma Performansı */}
      <div>
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Yazma Hızı ({performance.write}x Single Disk)</div> {/* Metin Türkçeleştir */}
        <div className="w-full h-4 bg-slate-300 dark:bg-navy-700 rounded overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${normalizedWrite}%` }}
          ></div>
        </div>
      </div>

      {/* Not */}
      {performance.note && (
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Not: {performance.note} {/* Not Türkçeleştir */}
        </div>
      )}
    </div>
  );
};

export default PerformanceIndicator;