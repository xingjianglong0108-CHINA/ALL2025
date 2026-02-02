
import React, { useState } from 'react';
import IOSCard from './IOSCard';

const MPALModule: React.FC = () => {
  const [markers, setMarkers] = useState<string[]>([]);

  const toggle = (m: string) => setMarkers(prev => 
    prev.includes(m) ? prev.filter(i => i !== m) : [...prev, m]
  );

  const diagnose = () => {
    const hasMyeloid = markers.includes('MPO') || (markers.includes('NSE') && markers.includes('CD11c'));
    const hasT = markers.includes('cCD3') || markers.includes('sCD3');
    const hasB = (markers.includes('CD19_strong') && (markers.includes('CD79a') || markers.includes('cCD22') || markers.includes('CD10'))) ||
                 (markers.includes('CD19_weak') && [markers.includes('CD79a'), markers.includes('cCD22'), markers.includes('CD10')].filter(Boolean).length >= 2);

    if (hasB && hasMyeloid) return 'MPAL (B/Myeloid)';
    if (hasT && hasMyeloid) return 'MPAL (T/Myeloid)';
    if (hasB && hasT) return 'MPAL (B/T)';
    return '不符合MPAL诊断标准';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <IOSCard title="诊断结果">
        <div className="p-4 bg-blue-50 rounded-xl text-center font-bold text-blue-700">
          {diagnose()}
        </div>
      </IOSCard>

      <IOSCard title="髓系标记 (Myeloid)">
        <div className="space-y-2">
          <button onClick={() => toggle('MPO')} className={`w-full text-left p-3 rounded-xl border text-xs ${markers.includes('MPO') ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>MPO 强表达 (>3%)</button>
          <div className="grid grid-cols-2 gap-2">
            {['NSE', 'CD11c', 'CD14', 'CD64'].map(m => (
              <button key={m} onClick={() => toggle(m)} className={`p-2 rounded-lg border text-xs ${markers.includes(m) ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>{m}</button>
            ))}
          </div>
        </div>
      </IOSCard>

      <IOSCard title="T系标记">
        <div className="grid grid-cols-2 gap-2">
          {['cCD3', 'sCD3'].map(m => (
            <button key={m} onClick={() => toggle(m)} className={`p-2 rounded-lg border text-xs ${markers.includes(m) ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>{m}</button>
          ))}
        </div>
      </IOSCard>

      <IOSCard title="B系标记">
        <div className="space-y-2">
          <div className="flex gap-2">
            <button onClick={() => toggle('CD19_strong')} className={`flex-1 p-2 rounded-lg border text-xs ${markers.includes('CD19_strong') ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>CD19 强表达</button>
            <button onClick={() => toggle('CD19_weak')} className={`flex-1 p-2 rounded-lg border text-xs ${markers.includes('CD19_weak') ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>CD19 弱表达</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['CD79a', 'cCD22', 'CD10'].map(m => (
              <button key={m} onClick={() => toggle(m)} className={`p-2 rounded-lg border text-xs ${markers.includes(m) ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>{m}</button>
            ))}
          </div>
        </div>
      </IOSCard>
    </div>
  );
};

export default MPALModule;
