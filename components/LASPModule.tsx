
import React, { useState } from 'react';
import IOSCard from './IOSCard';
import { PatientInfo } from '../types';

interface Props {
  bsa: number;
  patient: PatientInfo;
}

const LASPModule: React.FC<Props> = ({ bsa, patient }) => {
  const [fib, setFib] = useState('');
  const [at3, setAt3] = useState('');

  const weight = parseFloat(patient.weight);

  const getAdvice = () => {
    const f = parseFloat(fib);
    const a = parseFloat(at3);
    const advices = [];

    if (f > 0 && f < 0.3) {
      advices.push('纤维蛋白原极低: 建议补充纤维蛋白原制剂 10-20mg/kg (除非明显出血，否则不主张过激补充)。');
    } else if (f > 0 && f < 0.5) {
      advices.push('纤维蛋白原降低 (<0.5g/L): 密切观察，若有出血风险建议预防性补充。');
    }

    if (a > 0 && a < 30) {
      advices.push('AT-III 严重降低 (<30%): 极高血栓风险。必须考虑抗凝干预 (如利伐沙班或达比加群酯)。');
    } else if (a > 0 && a < 60) {
      advices.push('AT-III 降低 (<60%): 建议普通肝素 100 UI/kg/天 或低分子肝素预防血栓。');
    }

    return advices;
  };

  const getRivaroxabanSuggest = () => {
    if (!weight) return "请先在'病人信息'中录入体重";
    if (weight < 30) return "建议参考儿科专业剂量 (通常 0.1mg/kg bid 或遵循说明书)";
    if (weight < 50) return "15 mg，每日一次 (qd)";
    return "20 mg，每日一次 (qd)";
  };

  const getDabigatranSuggest = () => {
    if (!weight) return "请先在'病人信息'中录入体重";
    // Standard pediatric/adult-like reference
    if (weight < 40) return "建议参考儿科减量方案 (通常 bid 给药)";
    if (weight < 70) return "110 mg，每日两次 (bid)";
    return "150 mg，每日两次 (bid)";
  };

  const advices = getAdvice();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-8">
      <IOSCard title="凝血指标监测">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="text-sm font-medium text-gray-700">纤维蛋白原 (Fib, g/L)</span>
            <input type="number" placeholder="0.0" value={fib} onChange={e => setFib(e.target.value)} className="w-24 text-right outline-none text-sm font-semibold text-blue-600" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">抗凝血酶-III (AT-III, %)</span>
            <input type="number" placeholder="0" value={at3} onChange={e => setAt3(e.target.value)} className="w-24 text-right outline-none text-sm font-semibold text-blue-600" />
          </div>
        </div>
      </IOSCard>

      {advices.length > 0 && (
        <IOSCard title="实时处理建议">
          <ul className="space-y-3">
            {advices.map((a, i) => (
              <li key={i} className="text-xs text-red-800 bg-red-50 p-3 rounded-xl border border-red-100 flex items-start space-x-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </IOSCard>
      )}

      <IOSCard title="抗凝药物剂量参考 (血栓预防/治疗)">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-gray-700 mb-2 border-l-4 border-blue-500 pl-2">利伐沙班 (Rivaroxaban)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left">
                <thead className="text-gray-400 font-normal">
                  <tr>
                    <th className="pb-1">体重范围</th>
                    <th className="pb-1">推荐剂量</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-100">
                  <tr><td className="py-1.5">&lt; 30 kg</td><td className="py-1.5">0.1 mg/kg bid 或遵循专科</td></tr>
                  <tr><td className="py-1.5">30 - 50 kg</td><td className="py-1.5">15 mg qd</td></tr>
                  <tr><td className="py-1.5">&gt; 50 kg</td><td className="py-1.5">20 mg qd</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-[10px] text-blue-700 font-medium">当前病人建议: {getRivaroxabanSuggest()}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="text-xs font-bold text-gray-700 mb-2 border-l-4 border-purple-500 pl-2">达比加群酯 (Dabigatran)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left">
                <thead className="text-gray-400 font-normal">
                  <tr>
                    <th className="pb-1">体重范围</th>
                    <th className="pb-1">推荐剂量</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-100">
                  <tr><td className="py-1.5">40 - 70 kg</td><td className="py-1.5">110 mg bid</td></tr>
                  <tr><td className="py-1.5">&gt; 70 kg</td><td className="py-1.5">150 mg bid</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-[10px] text-purple-700 font-medium">当前病人建议: {getDabigatranSuggest()}</p>
            </div>
          </div>
        </div>
      </IOSCard>

      <IOSCard title="L-ASP 监测及干预要点">
        <div className="text-[11px] text-gray-500 leading-relaxed space-y-2">
          <p className="flex items-start">
            <span className="mr-1 text-blue-500 font-bold">•</span>
            <span><b>监测频率:</b> 每次 L-ASP 输注前(d8, d10)及 d12-d28 每隔一天评估 Fib 和 AT-III。</span>
          </p>
          <p className="flex items-start">
            <span className="mr-1 text-blue-500 font-bold">•</span>
            <span><b>CVST 警示:</b> 警惕静脉窦血栓(CVST)，如出现无法解释的头痛、喷射性呕吐或精神萎靡，应查头部 MRI + MRV。</span>
          </p>
          <p className="flex items-start">
            <span className="mr-1 text-blue-500 font-bold">•</span>
            <span><b>Fib 补充:</b> 当 Fib &lt; 0.5g/L 且有出血倾向或需进行腰穿等有创操作时，建议补充纤维蛋白原。</span>
          </p>
          <p className="flex items-start">
            <span className="mr-1 text-blue-500 font-bold">•</span>
            <span><b>血小板支持:</b> 治疗期间若血小板 &lt; 20×10⁹/L，必须及时输注血小板，防止自发性出血。</span>
          </p>
        </div>
      </IOSCard>
    </div>
  );
};

export default LASPModule;
