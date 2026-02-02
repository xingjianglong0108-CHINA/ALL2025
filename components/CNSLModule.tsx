
import React, { useState } from 'react';
import IOSCard from './IOSCard';

const CNSLModule: React.FC = () => {
  const [inputs, setInputs] = useState({ wbc: '', rbc: '', cells: false, clinical: false, mri: false, bloodWbc: '', bloodRbc: '' });

  const getStatus = () => {
    const wbc = parseFloat(inputs.wbc);
    const rbc = parseFloat(inputs.rbc);
    const bWbc = parseFloat(inputs.bloodWbc);
    const bRbc = parseFloat(inputs.bloodRbc);

    if (inputs.clinical || inputs.mri) return 'CNS3 (确诊CNSL)';
    
    // CNS3 Criteria
    if (rbc < 10 && wbc > 5 && inputs.cells) return 'CNS3 (确诊CNSL)';
    if (rbc >= 10 && wbc > 5 && inputs.cells) {
       // Steinherz/Bleyer algorithm
       if (bWbc && bRbc && (wbc / rbc) >= 2 * (bWbc / bRbc)) return 'CNS3 (确诊CNSL)';
    }

    // CNS2 Criteria
    if (wbc <= 5 && inputs.cells) return 'CNS2';
    if (rbc >= 10 && wbc > 5 && inputs.cells) return 'CNS2 (Steinherz算法阴性)';

    return 'CNS1 (正常)';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <IOSCard title="分级结果">
        <div className="p-4 bg-purple-50 rounded-xl text-center font-bold text-purple-700">
          {getStatus()}
        </div>
      </IOSCard>

      <IOSCard title="脑脊液 (CSF) 数据">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">CSF WBC (个/μl)</span>
            <input type="number" value={inputs.wbc} onChange={e => setInputs(p => ({ ...p, wbc: e.target.value }))} className="w-20 text-right outline-none border-b" />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm">CSF RBC (个/μl)</span>
            <input type="number" value={inputs.rbc} onChange={e => setInputs(p => ({ ...p, rbc: e.target.value }))} className="w-20 text-right outline-none border-b" />
          </div>
          <div className="flex items-center space-x-2 py-1">
             <input type="checkbox" checked={inputs.cells} onChange={e => setInputs(p => ({ ...p, cells: e.target.checked }))} className="w-4 h-4 rounded-full" />
             <span className="text-sm">涂片/流式见白血病细胞</span>
          </div>
        </div>
      </IOSCard>

      <IOSCard title="临床及影像">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <input type="checkbox" checked={inputs.clinical} onChange={e => setInputs(p => ({ ...p, clinical: e.target.checked }))} />
            <span className="text-xs">颅神经麻痹 (排除其他原因)</span>
          </label>
          <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <input type="checkbox" checked={inputs.mri} onChange={e => setInputs(p => ({ ...p, mri: e.target.checked }))} />
            <span className="text-xs">MRI显示脑或脑膜病变</span>
          </label>
        </div>
      </IOSCard>

      <div className="px-1 py-4">
        <p className="text-[10px] text-gray-400">注：若腰穿有损伤(RBC≥10)，建议录入外周血WBC和RBC以启用Steinherz计算。</p>
      </div>
    </div>
  );
};

export default CNSLModule;
