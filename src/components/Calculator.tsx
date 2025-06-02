import React, { useState, useEffect } from 'react';
// import DiskCountSelector from './DiskCountSelector'; // Artık kullanılmıyor
// import DiskCapacitySelector from './DiskCapacitySelector'; // Artık kullanılmıyor
import RaidSelector from './RaidSelector';
import ResultsDisplay from './ResultsDisplay';
import RaidLayout from './RaidLayout';
import PerformanceIndicator from './PerformanceIndicator';
import DriveSelection from './DriveSelection';
import { calculateRaidCapacity } from '../utils/raidCalculations';
import { RaidLevel, RaidCalculationResult } from '../types';
import { Copy, AlertCircle, Sun, Moon } from 'lucide-react'; // Sun ve Moon ikonlarını ekle

const Calculator: React.FC = () => {
  // diskCount state'i artık diskCountsByCapacity'den hesaplanacak
  // const [diskCount, setDiskCount] = useState<number>(0);
  // diskCapacity state'i artık farklı kapasiteleri temsil etmiyor
  // const [diskCapacity, setDiskCapacity] = useState<number>(4);
  const [diskCountsByCapacity, setDiskCountsByCapacity] = useState<Map<number, number>>(new Map());
  const [selectedCapacity, setSelectedCapacity] = useState<number>(4); // Varsayılan seçili kapasite
  const [raidLevel, setRaidLevel] = useState<RaidLevel>('RAID 0'); // Başlangıçta RAID 0 seçili olsun
  const [results, setResults] = useState<RaidCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  // isDarkMode state'i App.tsx'e taşındı, burada gerek yok
  // const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Disk sayısı 0 ise hesaplama yapma
    if (Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0) === 0) {
        setResults(null);
        setError(null);
        return;
    }

    try {
      if (
        (raidLevel === 'RAID 5' && Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0) < 3) || 
        (raidLevel === 'RAID 6' && Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0) < 4) ||
        (raidLevel === 'RAID 10' && (Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0) < 4 || Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0) % 2 !== 0))
      ) {
        throw new Error(`Requires at least ${
          raidLevel === 'RAID 5' ? '3' : 
          raidLevel === 'RAID 6' ? '4' : 
          '4 or more (even number)'
        } disks for ${raidLevel}.`); // Hata mesajını İngilizce'ye çevir
      }
      
      const result = calculateRaidCapacity(Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0), selectedCapacity, raidLevel);
      setResults(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred'); // Hata mesajını İngilizce'ye çevir
      }
      setResults(null);
    }
  }, [diskCountsByCapacity, selectedCapacity, raidLevel]);

  const copyConfiguration = () => {
    const config = {
      raidLevel,
      // diskCount, // Artık tek bir değer değil
      diskCountsByCapacity: Array.from(diskCountsByCapacity.entries()), // Map'i kopyalanabilir hale getir
      results
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dark mode toggle App.tsx'e taşındı */}
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Depolama Hesaplayıcı</h2>
        <div className="flex gap-2">
          <button
            onClick={copyConfiguration}
            className="btn btn-secondary flex items-center gap-2"
            title="Copy Configuration"
          >
            <Copy size={16} />
            {showCopied ? 'Copied!' : 'Copy Configuration'}
          </button>
        </div>
      </div> */}
      
      <div className="space-y-8">
        <DriveSelection
          // diskCount ve setDiskCount propları DriveSelection'dan kaldırıldı
          // diskCount={diskCount}
          // setDiskCount={setDiskCount}
          // diskCapacity ve setDiskCapacity propları DriveSelection'dan kaldırıldı
          // diskCapacity={diskCapacity}
          // setDiskCapacity={setDiskCapacity}
          raidLevel={raidLevel}
          diskCountsByCapacity={diskCountsByCapacity}
          setDiskCountsByCapacity={setDiskCountsByCapacity}
          selectedCapacity={selectedCapacity}
          setSelectedCapacity={setSelectedCapacity}
          currentTotalDiskCount={Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0)} // Toplam disk sayısını hesapla
        />

        {/* Disk sayısı > 0 olduğunda RAID Selector'ü göster */}
        {Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0) > 0 && (
           <div className="card animate-slide-up">
            <RaidSelector 
              raidLevel={raidLevel} 
              setRaidLevel={setRaidLevel}
              // diskCount prop'u artık tek bir değer değil
              // diskCount={diskCount}
               diskCount={Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0)} // Toplam disk sayısını geç
            />
          </div>
        )}
        
        {/* Sonuçlar (Kapasite, Layout, Performans) sadece sonuçlar hesaplandığında göster */}
        {results ? (
          <>
            <div className="card animate-slide-up">
              <ResultsDisplay results={results} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card animate-slide-up">
                <RaidLayout 
                  raidLevel={raidLevel} 
                  // diskCount prop'u artık tek bir değer değil
                  // diskCount={diskCount}
                   diskCount={Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0)} // Toplam disk sayısını geç
                   // diskCapacity prop'u kaldırıldı
                   // diskCapacity={diskCapacity}
                   diskCountsByCapacity={diskCountsByCapacity} // State'i geç
                />
              </div>
              
              <div className="card animate-slide-up">
                <PerformanceIndicator 
                  raidLevel={raidLevel} 
                  // diskCount prop'u artık tek bir değer değil
                  // diskCount={diskCount}
                   diskCount={Array.from(diskCountsByCapacity.values()).reduce((sum, count) => sum + count, 0)} // Toplam disk sayısını geç
                   diskCountsByCapacity={diskCountsByCapacity} // State'i geç
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Calculator;