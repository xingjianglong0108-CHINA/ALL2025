
import React, { useState } from 'react';
import IOSCard from './IOSCard';
import { PatientInfo } from '../types';

interface Props {
  patient: PatientInfo;
}

const RiskStratification: React.FC<Props> = ({ patient }) => {
  const [mrd, setMrd] = useState({ d15: '', d33: '', w12: '' });
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [extra, setExtra] = useState<string[]>([]);

  const toggleGene = (gene: string) => {
    setSelectedGenes(prev => prev.includes(gene) ? prev.filter(g => g !== gene) : [...prev, gene]);
  };

  const toggleExtra = (item: string) => {
    setExtra(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const getRiskLevel = () => {
    const age = parseFloat(patient.age);
    const wbc = parseFloat(patient.initialWbc);
    const mrd15 = parseFloat(mrd.d15);
    const mrd33 = parseFloat(mrd.d33);
    const mrdW12 = parseFloat(mrd.w12);

    const isHR = 
      mrd15 >= 10 || 
      mrd33 >= 1 || 
      mrdW12 >= 0.01 ||
      selectedGenes.some(g => ['MLL', 'LowHypo', 'iAMP21', 'IKZF1+', 'TCF3-HLF'].includes(g)) ||
      extra.includes('Failure');

    if (isHR) return { 
      level: '高危 (High Risk)', 
      color: 'text-white', 
      bg: 'bg-gradient-to-br from-red-500 to-red-700',
      shadow: 'shadow-red-200',
      desc: '需强化化疗及密切监测'
    };

    const isIR = 
      age >= 10 || 
      wbc >= 50 || 
      extra.includes('T-ALL') || 
      extra.includes('CNSL/TL') ||
      selectedGenes.includes('Ph+') || 
      selectedGenes.includes('Ph-like') || 
      selectedGenes.includes('t(1;19)') ||
      (mrd15 >= 0.1 && mrd15 < 10) ||
      (mrd33 >= 0.01 && mrd33 < 1);

    if (isIR) return { 
      level: '中危 (Intermediate Risk)', 
      color: 'text-white', 
      bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
      shadow: 'shadow-orange-200',
      desc: '标准方案治疗，评估后续反应'
    };

    if (age >= 1 && age < 10 && wbc < 50 && mrd15 < 0.1 && mrd33 < 0.01) {
      return { 
        level: '低危 (Low Risk)', 
        color: 'text-white', 
        bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
        shadow: 'shadow-emerald-200',
        desc: '预后良好，按常规方案执行'
      };
    }

    return { 
      level: '评估中...', 
      color: 'text-gray-400', 
      bg: 'bg-gray-100', 
      shadow: 'shadow-none',
      desc: '请完善上方所有关键数据'
    };
  };

  const risk = getRiskLevel();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className={`p-6 rounded-[32px] mb-6 text-center ${risk.bg} ${risk.shadow} shadow-2xl transition-all duration-500 transform hover:scale-[1.02]`}>
        <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Assessment Result</div>
        <div className={`text-2xl font-black ${risk.color} mb-1`}>{risk.level}</div>
        <div className="text-white/80 text-[11px] font-medium">{risk.desc}</div>
      </div>

      <IOSCard title="疗效评估 (MRD %)">
        <div className="grid grid-cols-3 gap-3">
          {['d15', 'd33', 'w12'].map((day) => (
            <div key={day} className="flex flex-col items-center bg-gray-50 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">{day}</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={(mrd as any)[day]}
                onChange={(e) => setMrd(prev => ({ ...prev, [day]: e.target.value }))}
                className="w-full text-center text-sm font-bold text-gray-900 bg-transparent outline-none border-b border-gray-200 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </IOSCard>

      <IOSCard title="遗传学异常">
        <div className="grid grid-cols-3 gap-2">
          {['Ph+', 'Ph-like', 'MLL', 't(1;19)', 'LowHypo', 'iAMP21', 'IKZF1+', 'TCF3-HLF'].map(gene => (
            <button 
              key={gene}
              onClick={() => toggleGene(gene)}
              className={`text-[10px] font-bold py-3 px-1 rounded-xl border-2 transition-all duration-300 ${
                selectedGenes.includes(gene) 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-95' 
                  : 'bg-white border-gray-50 text-gray-500 hover:border-blue-200'
              }`}
            >
              {gene}
            </button>
          ))}
        </div>
      </IOSCard>

      <IOSCard title="临床合并因素">
        <div className="space-y-3">
          {[
            { id: 'T-ALL', label: 'T-ALL 亚型', icon: '🧬' },
            { id: 'CNSL/TL', label: '伴 CNSL 或睾丸受累 (TL)', icon: '🧠' },
            { id: 'Failure', label: 'd33 未达 CR / 瘤灶缩小不足', icon: '⚠️' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => toggleExtra(item.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 flex justify-between items-center transition-all ${
                extra.includes(item.id) 
                  ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                  : 'bg-gray-50 border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                extra.includes(item.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-200'
              }`}>
                {extra.includes(item.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </IOSCard>
    </div>
  );
};

export default RiskStratification;
