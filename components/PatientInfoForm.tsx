
import React from 'react';
import IOSCard from './IOSCard';
import { PatientInfo } from '../types';

interface Props {
  patient: PatientInfo;
  setPatient: React.Dispatch<React.SetStateAction<PatientInfo>>;
  bsa: number;
}

const PatientInfoForm: React.FC<Props> = ({ patient, setPatient, bsa }) => {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-2">
      <IOSCard title="登记信息">
        <div className="divide-y divide-gray-50">
          {/* 姓名与住院号 */}
          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">患者姓名</span>
              <input
                type="text"
                placeholder="请输入"
                value={patient.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full outline-none text-sm font-bold text-gray-900 bg-transparent placeholder:text-gray-200"
              />
            </div>
            <div className="flex flex-col border-l border-gray-50 pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">住院号</span>
              <input
                type="text"
                placeholder="ID号"
                value={patient.hospitalId}
                onChange={(e) => handleChange('hospitalId', e.target.value)}
                className="w-full outline-none text-sm font-bold text-gray-900 bg-transparent placeholder:text-gray-200"
              />
            </div>
          </div>

          {/* 性别与年龄 */}
          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">性别</span>
              <div className="flex bg-gray-100/50 p-1 rounded-xl w-fit">
                {['male', 'female'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleChange('gender', g)}
                    className={`text-[10px] px-3 py-1 rounded-lg font-bold transition-all ${
                      patient.gender === g 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    {g === 'male' ? '男' : '女'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col border-l border-gray-50 pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">年龄 (岁)</span>
              <input
                type="number"
                placeholder="0"
                value={patient.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className="w-full outline-none text-sm font-bold text-gray-900 bg-transparent"
              />
            </div>
          </div>
        </div>
      </IOSCard>

      <IOSCard title="体格指标">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Height</span>
              <div className="flex items-baseline">
                <input
                  type="number"
                  placeholder="0"
                  value={patient.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className="w-16 bg-transparent outline-none text-xl font-black text-gray-900"
                />
                <span className="text-xs text-gray-400 ml-1">cm</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Weight</span>
              <div className="flex items-baseline justify-end">
                <input
                  type="number"
                  placeholder="0"
                  value={patient.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="w-16 bg-transparent outline-none text-xl font-black text-gray-900 text-right"
                />
                <span className="text-xs text-gray-400 ml-1">kg</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-600 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-xl mr-3">
                <span className="text-white text-xs">📏</span>
              </div>
              <span className="text-sm font-bold text-white">体表面积 (BSA)</span>
            </div>
            <span className="text-lg font-black text-white">
              {bsa > 0 ? `${bsa.toFixed(2)}` : '--'} <span className="text-xs font-normal opacity-70">m²</span>
            </span>
          </div>
        </div>
      </IOSCard>

      <IOSCard title="实验室初诊数据">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-700">初诊 WBC 计数</span>
            <span className="text-[10px] text-gray-400">×10⁹/L</span>
          </div>
          <input
            type="number"
            placeholder="0.0"
            value={patient.initialWbc}
            onChange={(e) => handleChange('initialWbc', e.target.value)}
            className="w-24 p-3 bg-gray-50 rounded-xl text-right outline-none text-lg font-black text-blue-600 focus:bg-blue-50 transition-colors"
          />
        </div>
      </IOSCard>
    </div>
  );
};

export default PatientInfoForm;
