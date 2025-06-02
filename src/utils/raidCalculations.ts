import { RaidLevel, RaidCalculationResult } from '../types';

export function calculateRaidCapacity(
  diskCount: number,
  diskCapacity: number,
  raidLevel: RaidLevel
): RaidCalculationResult {
  const totalRawCapacity = diskCount * diskCapacity;
  
  let usableCapacity = 0;
  let capacityUsedForProtection = 0;
  let faultTolerance = 0;
  let specialFaultToleranceNote = '';
  let performanceNote = '';
  
  switch (raidLevel) {
    case 'RAID 0':
      usableCapacity = totalRawCapacity;
      capacityUsedForProtection = 0;
      faultTolerance = 0;
      performanceNote = 'En yüksek performans, yedeklilik yok';
      break;
      
    case 'RAID 1':
      if (diskCount < 2) {
        throw new Error('RAID 1 en az 2 disk gerektirir');
      }
      usableCapacity = diskCapacity;
      capacityUsedForProtection = totalRawCapacity - usableCapacity;
      faultTolerance = Math.floor(diskCount / 2);
      performanceNote = 'İyi okuma performansı, yazma tek diske sınırlı';
      break;
      
    case 'RAID 5':
      if (diskCount < 3) {
        throw new Error('RAID 5 en az 3 disk gerektirir');
      }
      usableCapacity = (diskCount - 1) * diskCapacity;
      capacityUsedForProtection = diskCapacity; // Bir disk parity için
      faultTolerance = 1;
      performanceNote = 'Parity yükü ile iyi genel performans';
      break;
      
    case 'RAID 6':
      if (diskCount < 4) {
        throw new Error('RAID 6 en az 4 disk gerektirir');
      }
      usableCapacity = (diskCount - 2) * diskCapacity;
      capacityUsedForProtection = 2 * diskCapacity; // İki disk parity için
      faultTolerance = 2;
      performanceNote = 'Çift parity nedeniyle azaltılmış performans';
      break;
      
    case 'RAID 10':
      if (diskCount < 4 || diskCount % 2 !== 0) {
        throw new Error('RAID 10 en az 4 disk gerektirir (çift sayı)');
      }
      usableCapacity = Math.floor(diskCount / 2) * diskCapacity;
      capacityUsedForProtection = totalRawCapacity - usableCapacity;
      faultTolerance = 1;
      specialFaultToleranceNote = 'Her ayna çiftinden en fazla 1 disk';
      performanceNote = 'Mükemmel okuma performansı, iyi yazma performansı';
      break;
      
    default:
      throw new Error(`Bilinmeyen RAID seviyesi: ${raidLevel}`);
  }
  
  // Performans hesaplamaları
  const readPerformance = calculateReadPerformance(raidLevel, diskCount);
  const writePerformance = calculateWritePerformance(raidLevel, diskCount);
  
  return {
    totalRawCapacity,
    usableCapacity,
    capacityUsedForProtection,
    faultTolerance,
    specialFaultToleranceNote,
    performanceNote,
    readPerformance,
    writePerformance
  };
}

function calculateReadPerformance(raidLevel: RaidLevel, diskCount: number): number {
  switch (raidLevel) {
    case 'RAID 0':
      return diskCount;
    case 'RAID 1':
      return diskCount;
    case 'RAID 5':
      return diskCount - 1;
    case 'RAID 6':
      return diskCount - 2;
    case 'RAID 10':
      return diskCount;
    default:
      return 1;
  }
}

function calculateWritePerformance(raidLevel: RaidLevel, diskCount: number): number {
  switch (raidLevel) {
    case 'RAID 0':
      return diskCount;
    case 'RAID 1':
      return 1;
    case 'RAID 5':
      return diskCount - 1;
    case 'RAID 6':
      return diskCount - 2;
    case 'RAID 10':
      return diskCount / 2;
    default:
      return 1;
  }
}