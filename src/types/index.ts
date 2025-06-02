export type RaidLevel = 'RAID 0' | 'RAID 1' | 'RAID 5' | 'RAID 6' | 'RAID 10';

export interface RaidCalculationResult {
  totalRawCapacity: number;
  usableCapacity: number;
  capacityUsedForProtection: number;
  faultTolerance: number;
  specialFaultToleranceNote?: string;
  performanceNote: string;
  readPerformance: number;
  writePerformance: number;
}

export interface RaidLayoutProps {
  raidLevel: RaidLevel;
  diskCount: number;
  diskCountsByCapacity: Map<number, number>;
}

export interface PerformanceIndicatorProps {
  raidLevel: RaidLevel;
  diskCount: number;
  diskCountsByCapacity: Map<number, number>;
}