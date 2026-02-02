
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

  const getButtonStyle = (m: string) => {
    return `transition-all duration-200 border rounded-xl p-3 text-xs font-semibold ${
      markers.includes(m) 
        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm shadow-blue-100' 
        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
    }`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <IOSCard title="诊断结果">
        <div className="p-4 bg-blue-50/80 rounded-2xl text-center font-black text-blue-700 border border-blue-100/50">
          {diagnose()}
        </div>
      </IOSCard>

      <IOSCard title="髓系标记 (Myeloid)">
        <div className="space-y-3">
          <button 
            onClick={() => toggle('MPO')} 
            className={`w-full text-left ${getButtonStyle('MPO')}`}
          >
            <div className="flex justify-between items-center">
              <span>MPO 强表达 (&gt;3%)</span>
              {markers.includes('MPO') && <span className="text-[10px]">✅</span>}
            </div>
          </button>
          <div className="grid grid-cols-2 gap-2">
            {['NSE', 'CD11c', 'CD14', 'CD64'].map(m => (
              <button 
                key={m} 
                onClick={() => toggle(m)} 
                className={getButtonStyle(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </IOSCard>

      <IOSCard title="T系标记">
        <div className="grid grid-cols-2 gap-2">
          {['cCD3', 'sCD3'].map(m => (
            <button 
              key={m} 
              onClick={() => toggle(m)} 
              className={getButtonStyle(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </IOSCard>

      <IOSCard title="B系标记">
        <div className="space-y-3">
          <div className="flex gap-2">
            <button 
              onClick={() => toggle('CD19_strong')} 
              className={`flex-1 ${getButtonStyle('CD19_strong')}`}
            >
              CD19 强表达
            </button>
            <button 
              onClick={() => toggle('CD19_weak')} 
              className={`flex-1 ${getButtonStyle('CD19_weak')}`}
            >
              CD19 弱表达
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['CD79a', 'cCD22', 'CD10'].map(m => (
              <button 
                key={m} 
                onClick={() => toggle(m)} 
                className={getButtonStyle(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </IOSCard>
      
      <div className="px-2 py-4">
        <p className="text-[9px] text-gray-400 leading-relaxed text-center italic">
          注：诊断标准参考 2016 WHO 分类。CD19 强/弱表达判定的判定需结合流式细胞术。
        </p>
      </div>
    </div>
  );
};

export default MPALModule;
