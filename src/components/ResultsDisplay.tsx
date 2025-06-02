import React from 'react';
import { RaidCalculationResult } from '../types';
import CapacityBar from './CapacityBar';
import { formatCapacityBinary } from '../utils/formatters';

interface ResultsDisplayProps {
  results: RaidCalculationResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 mt-6">
      <h3 className="text-lg font-semibold text-navy-700 mb-4">Storage Capacity Results</h3>
      
      <div className="space-y-6">
        <CapacityBar 
          totalCapacity={results.totalRawCapacity}
          usableCapacity={results.usableCapacity}
          protectionCapacity={results.capacityUsedForProtection}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="text-sm text-slate-500 mb-1">Total Raw Capacity</div>
            <div className="text-2xl font-bold text-navy-700">
              {formatCapacityBinary(results.totalRawCapacity)}
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="text-sm text-slate-500 mb-1">Usable Capacity</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCapacityBinary(results.usableCapacity)}
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="text-sm text-slate-500 mb-1">Used for Protection</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCapacityBinary(results.capacityUsedForProtection)}
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="text-sm text-slate-500 mb-1">Fault Tolerance</div>
            <div className="text-2xl font-bold text-navy-700">
              {results.faultTolerance === 0 
                ? "None" 
                : `${results.faultTolerance} disk${results.faultTolerance > 1 ? 's' : ''}`}
              {results.specialFaultToleranceNote && (
                <div className="text-sm font-normal mt-1 text-slate-600">
                  {results.specialFaultToleranceNote}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay