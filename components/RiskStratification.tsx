
import React, { useState } from 'react';
import { ShieldAlert, Dna, Info } from 'lucide-react';
import IOSCard from './IOSCard';
import { PatientInfo } from '../types';

interface Props {
  patient: PatientInfo;
}

const GENETIC_OPTIONS = [
  { id: 'MLL', label: 'KMT2A (MLL) 重排', risk: 'HR' },
  { id: 'MEF2D_BCL9', label: 'MEF2D::BCL9', risk: 'IR' },
  { id: 'TCF3_HLF', label: 'TCF3-HLF', risk: 'HR' },
  { id: 'HYPO', label: '低二倍体 (<44)', risk: 'HR' },
  { id: 'IKZF1', label: 'IKZF1 缺失 (无DUX4)', risk: 'HR' },
  { id: 't1_19', label: 't(1;19) (TCF3-PBX1)', risk: 'IR' },
  { id: 'PH', label: 'Ph-ALL / Ph-Like', risk: 'IR' },
  { id: 'MEF2D_OTHER', label: '其他 MEF2D 重排', risk: 'IR' },
  { id: 't12_21', label: 't(12;21) / ETV6-RUNX1', risk: 'LR' },
  { id: 'HYPER', label: '超二倍体 (>50)', risk: 'LR' }
];

const RiskStratification: React.FC<Props> = ({ patient }) => {
  const [mrd, setMrd] = useState({ d15: '', d33: '', w12: '' });
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [extra, setExtra] = useState<string[]>([]);

  const toggleGene = (id: string) => {
    setSelectedGenes(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
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

    // 高危 (High Risk) 判定
    const hasHRGenetics = selectedGenes.some(g => 
      ['MLL', 'TCF3_HLF', 'HYPO', 'IKZF1'].includes(g)
    );
    const isHR = 
      mrd15 >= 10 || 
      mrd33 >= 1 || 
      mrdW12 >= 0.01 ||
      hasHRGenetics ||
      extra.includes('Failure');

    if (isHR) return { 
      level: '高危 (High Risk)', 
      color: 'text-white', 
      bg: 'bg-gradient-to-br from-[#FF3B30] to-[#C42E27]',
      shadow: 'shadow-red-200',
      desc: '需强化治疗，密切关注 MRD 动态',
      status: 'HR'
    };

    // 中危 (Intermediate Risk) 判定
    const hasIRGenetics = selectedGenes.some(g => 
      ['PH', 't1_19', 'MEF2D_BCL9', 'MEF2D_OTHER'].includes(g)
    );
    const isClinicalIR = age >= 10 || wbc >= 50 || extra.includes('T-ALL') || extra.includes('CNSL/TL');
    const isMrdIR = (mrd15 >= 0.1 && mrd15 < 10) || (mrd33 >= 0.01 && mrd33 < 1);

    if (isClinicalIR || hasIRGenetics || isMrdIR) return { 
      level: '中危 (Intermediate Risk)', 
      color: 'text-white', 
      bg: 'bg-gradient-to-br from-[#FF9500] to-[#E68600]',
      shadow: 'shadow-orange-200',
      desc: '按标准中危方案治疗',
      status: 'IR'
    };

    // 低危 (Low Risk) 判定
    const hasLRGenetics = selectedGenes.some(g => ['t12_21', 'HYPER'].includes(g));
    const isClinicalLR = age >= 1 && age < 10 && wbc < 50;
    const isMrdLR = (mrd15 < 0.1 || !mrd.d15) && (mrd33 < 0.01 || !mrd.d33);

    if (hasLRGenetics && isClinicalLR && isMrdLR) {
      return { 
        level: '低危 (Low Risk)', 
        color: 'text-white', 
        bg: 'bg-gradient-to-br from-[#34C759] to-[#248A3D]',
        shadow: 'shadow-emerald-200',
        desc: '预后良好，建议维持现行方案',
        status: 'LR'
      };
    }

    return { 
      level: '评估中...', 
      color: 'text-gray-400', 
      bg: 'bg-white', 
      shadow: 'shadow-none',
      desc: '请完善上方所有关键数据',
      status: 'PENDING'
    };
  };

  const risk = getRiskLevel();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      {/* 结果显示 */}
      <div className={`p-6 rounded-[32px] mb-6 text-center ${risk.bg} ${risk.shadow} shadow-2xl transition-all duration-500 border border-white/20`}>
        <div className="flex justify-center mb-2">
          <ShieldAlert size={24} className={risk.status === 'PENDING' ? 'text-gray-300' : 'text-white/80'} />
        </div>
        <div className={`text-2xl font-black ${risk.color} mb-1`}>{risk.level}</div>
        <div className={`${risk.status === 'PENDING' ? 'text-gray-400' : 'text-white/90'} text-[11px] font-medium`}>{risk.desc}</div>
      </div>

      <IOSCard title="疗效评估 (MRD %)">
        <div className="grid grid-cols-3 gap-3">
          {['d15', 'd33', 'w12'].map((day) => (
            <div key={day} className="flex flex-col items-center bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">{day}</span>
              <div className="flex items-center">
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={(mrd as any)[day]}
                  onChange={(e) => setMrd(prev => ({ ...prev, [day]: e.target.value }))}
                  className="w-full text-center text-sm font-bold text-gray-900 bg-transparent outline-none"
                />
                <span className="text-[10px] text-gray-400 ml-0.5">%</span>
              </div>
            </div>
          ))}
        </div>
      </IOSCard>

      {/* 分子与细胞遗传学 Panel */}
      <div className="mb-5">
        <div className="flex items-center px-1 mb-3">
          <Dna size={14} className="text-blue-500 mr-2" />
          <h2 className="text-[12px] font-bold text-gray-600 uppercase tracking-tight">分子与细胞遗传学 (V2.0)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {GENETIC_OPTIONS.map(gene => (
            <button 
              key={gene.id}
              onClick={() => toggleGene(gene.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                selectedGenes.includes(gene.id) 
                  ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                  : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
              }`}
            >
              <span className={`text-[11px] font-semibold text-left ${selectedGenes.includes(gene.id) ? 'text-blue-700' : 'text-gray-600'}`}>
                {gene.label}
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedGenes.includes(gene.id) ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-200'
              }`}>
                {selectedGenes.includes(gene.id) && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-inner" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <IOSCard title="临床合并因素">
        <div className="space-y-2.5">
          {[
            { id: 'T-ALL', label: 'T-ALL 亚型', icon: '🧬' },
            { id: 'CNSL/TL', label: '伴 CNSL 或睾丸受累 (TL)', icon: '🧠' },
            { id: 'Failure', label: 'd33 未达 CR / 瘤灶缩小不足', icon: '⚠️' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => toggleExtra(item.id)}
              className={`w-full text-left p-4 rounded-2xl border flex justify-between items-center transition-all ${
                extra.includes(item.id) 
                  ? 'bg-blue-50/50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-100 text-gray-500'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-[11px] font-bold">{item.label}</span>
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

      <div className="flex items-center justify-center p-4">
        <Info size={12} className="text-gray-300 mr-1.5" />
        <p className="text-[10px] text-gray-400">危险度分层基于 SCCCG-ALL-2025 最新方案</p>
      </div>
    </div>
  );
};

export default RiskStratification;
