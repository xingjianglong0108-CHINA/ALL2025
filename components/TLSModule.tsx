
import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Activity, Zap, ClipboardCheck } from 'lucide-react';
import IOSCard from './IOSCard';
import { PatientInfo } from '../types';

interface Props {
  patient: PatientInfo;
  bsa: number;
}

const TLSModule: React.FC<Props> = ({ patient, bsa }) => {
  const [lineage, setLineage] = useState<'B' | 'T' | 'Burkitt'>('B');
  const [isBulky, setIsBulky] = useState(false);
  const [hasLTLS, setHasLTLS] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'risk' | 'criteria' | 'manage'>('risk');

  const wbc = parseFloat(patient.initialWbc) || 0;

  // 风险分层逻辑 (严格遵循宝典 Table 4)
  const getRiskStratification = () => {
    if (lineage === 'Burkitt' || wbc >= 100 || hasLTLS) {
      return { 
        level: '高危 (High Risk)', 
        color: 'text-red-600', 
        bgColor: 'bg-red-50', 
        borderColor: 'border-red-100',
        gradient: 'from-red-500 to-red-600',
        hydration: 3000,
        monitor: '每 4-6 小时',
        drug: '首选 拉布立海 (Rasburicase)',
        advice: '必须严密监测入出量，尿量需 > 100ml/(m²·h)'
      };
    }
    if (wbc >= 25 || isBulky) {
      return { 
        level: '中危 (Intermediate Risk)', 
        color: 'text-orange-500', 
        bgColor: 'bg-orange-50', 
        borderColor: 'border-orange-100',
        gradient: 'from-orange-400 to-orange-500',
        hydration: 2500,
        monitor: '每 8-12 小时',
        drug: '非布司他 或 别嘌醇',
        advice: '注意尿液碱化（若尿酸偏高），维持尿比重 ≤ 1.010'
      };
    }
    return { 
      level: '低危 (Low Risk)', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-100',
      gradient: 'from-emerald-400 to-emerald-500',
      hydration: 2000,
      monitor: '每日一次 (24h)',
      drug: '口服 别嘌醇',
      advice: '常规水化，观察临床表现'
    };
  };

  const risk = getRiskStratification();
  const hydrationVolume = bsa > 0 ? bsa * risk.hydration : 0;
  const dripRate = hydrationVolume > 0 ? (hydrationVolume / 24).toFixed(1) : '0';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      {/* 子菜单导航 */}
      <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-[20px] mb-6 shadow-sm border border-white/50">
        {[
          { id: 'risk', label: '风险评估', icon: ShieldAlert },
          { id: 'manage', label: '处理流程', icon: Activity },
          { id: 'criteria', label: '诊断标准', icon: ClipboardCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-[16px] transition-all duration-300 ${
              activeSubTab === tab.id 
                ? 'bg-white shadow-sm text-blue-600' 
                : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <tab.icon size={14} className="mr-1.5" />
            <span className="text-[11px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeSubTab === 'risk' && (
        <div className="space-y-4 animate-in fade-in zoom-in-95">
          <IOSCard title="基础风险因子">
            <div className="space-y-4">
              <div className="flex bg-gray-100/50 p-1.5 rounded-2xl">
                {(['B', 'T', 'Burkitt'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setLineage(t)}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                      lineage === t ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {t === 'B' ? 'B-ALL' : t === 'T' ? 'T-ALL' : 'Burkitt'}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-700">巨块病变 (Bulky)</span>
                  <span className="text-[9px] text-gray-400 mt-0.5">纵隔块>1/3胸径 或 淋巴结直径>10cm</span>
                </div>
                <button
                  onClick={() => setIsBulky(!isBulky)}
                  className={`w-14 h-8 rounded-full transition-all relative p-1 ${isBulky ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${isBulky ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-gray-500">已符合实验室TLS诊断?</span>
                <button
                  onClick={() => setHasLTLS(!hasLTLS)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold border-2 transition-all ${
                    hasLTLS ? 'bg-red-500 border-red-500 text-white' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  {hasLTLS ? '已发生' : '未发生'}
                </button>
              </div>
            </div>
          </IOSCard>

          <div className={`p-5 rounded-[28px] border-2 bg-gradient-to-br ${risk.borderColor} ${risk.bgColor} mb-6 shadow-lg shadow-gray-100/50`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Risk Level</div>
                <div className={`text-xl font-black ${risk.color}`}>{risk.level}</div>
              </div>
              <div className={`p-3 rounded-2xl bg-white shadow-sm ${risk.color}`}>
                <ShieldAlert size={20} />
              </div>
            </div>
            <div className="bg-white/60 p-3 rounded-2xl">
              <div className="flex items-start">
                <Zap size={14} className={`${risk.color} mt-0.5 mr-2 shrink-0`} />
                <p className="text-[10px] font-medium text-gray-600 leading-relaxed">{risk.advice}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'manage' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <IOSCard title="水化与药物干预 (Table 6/7)">
            <div className={`bg-gradient-to-br ${risk.gradient} rounded-[28px] p-6 text-white shadow-xl shadow-blue-200`}>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">每日总入量</div>
                  <div className="text-3xl font-black tracking-tight">{Math.round(hydrationVolume)} <span className="text-sm font-normal opacity-60">ml</span></div>
                </div>
                <div className="text-right">
                  <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">建议滴速</div>
                  <div className="text-xl font-black">{dripRate} <span className="text-sm font-normal opacity-60">ml/h</span></div>
                </div>
              </div>
              
              <div className="h-[1px] bg-white/20 mb-5" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/10 p-3 rounded-2xl border border-white/10">
                  <div className="text-white/60 text-[9px] font-black mb-1 uppercase tracking-tighter">降尿酸药物</div>
                  <div className="text-[11px] font-black truncate">{risk.drug}</div>
                </div>
                <div className="bg-black/10 p-3 rounded-2xl border border-white/10">
                  <div className="text-white/60 text-[9px] font-black mb-1 uppercase tracking-tighter">临床监控频率</div>
                  <div className="text-[11px] font-black">{risk.monitor}</div>
                </div>
              </div>
            </div>
          </IOSCard>

          <IOSCard title="重要提醒 (宝典21页)">
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                <AlertTriangle size={16} className="text-blue-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-normal font-medium italic">
                  “治疗 TLS 最有效的方法是维持高尿流量。仅在尿酸极高且水化不充分时考虑碱化尿液。”
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  '维持尿比重 ≤ 1.010',
                  '目标尿量 > 100 ml/(m²·h)',
                  '高危患者在化疗前 4-12h 开始预水化',
                  '若发生高钾、高磷严重，需及时考虑透析'
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-[10px] text-gray-500 font-medium px-2">
                    <div className="w-1 h-1 bg-gray-300 rounded-full mr-3" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </IOSCard>
        </div>
      )}

      {activeSubTab === 'criteria' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <IOSCard title="实验室诊断标准 (LTLS) - Table 3">
            <div className="space-y-2">
              <div className="text-[10px] text-gray-400 mb-2 px-1">符合以下 2 项或以上指标 (在化疗开始后 3-7 天内):</div>
              {[
                { label: '尿酸 (UA)', value: '≥ 476', unit: 'μmol/L', change: '↑ 25%' },
                { label: '血钾 (K)', value: '≥ 6.0', unit: 'mmol/L', change: '↑ 25%' },
                { label: '血磷 (P)', value: '≥ 2.1*', unit: 'mmol/L', change: '↑ 25%' },
                { label: '血钙 (Ca)', value: '≤ 1.75', unit: 'mmol/L', change: '↓ 25%' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <span className="text-[9px] font-black text-gray-400 block uppercase">Threshold</span>
                      <span className="text-sm font-black text-gray-900">{item.value} <span className="text-[9px] font-normal">{item.unit}</span></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-gray-400 block uppercase">Baseline</span>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">{item.change}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[8px] text-gray-400 italic mt-2">* 儿童血磷 > 2.1 mmol/L (6.5mg/dL)，成人 > 1.45 mmol/L (4.5mg/dL)。</p>
            </div>
          </IOSCard>

          <IOSCard title="临床诊断标准 (CTLS) - Table 5">
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 mb-2">
                <p className="text-[10px] text-purple-700 font-bold leading-tight flex items-center">
                  <Activity size={12} className="mr-1.5" />
                  定义：实验室 TLS + 至少一项临床症状
                </p>
              </div>
              {[
                { name: '肾脏受损', detail: '肌酐增高 (≥1.5x ULN)' },
                { name: '心律失常', detail: '严重心律不齐或猝死' },
                { name: '神经系统', detail: '惊厥/癫痫发作 (Seizures)' }
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-800">{row.name}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{row.detail}</span>
                </div>
              ))}
            </div>
          </IOSCard>
        </div>
      )}

      <div className="px-6 py-4 text-center">
        <p className="text-[9px] text-gray-300 font-medium tracking-tight">
          * 提示：对于极高风险患者，Rasburicase 建议剂量为 0.1-0.2 mg/kg。
        </p>
      </div>
    </div>
  );
};

export default TLSModule;
