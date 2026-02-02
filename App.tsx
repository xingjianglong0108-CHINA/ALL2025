
import React, { useState, useMemo } from 'react';
import { 
  User, 
  ShieldAlert, 
  Dna, 
  Brain, 
  Activity, 
  ThermometerSnowflake 
} from 'lucide-react';
import PatientInfoForm from './components/PatientInfoForm';
import RiskStratification from './components/RiskStratification';
import MPALModule from './components/MPALModule';
import CNSLModule from './components/CNSLModule';
import LASPModule from './components/LASPModule';
import TLSModule from './components/TLSModule';
import { PatientInfo } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const [patient, setPatient] = useState<PatientInfo>({
    name: '',
    hospitalId: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    initialWbc: ''
  });

  const bsa = useMemo(() => {
    const h = parseFloat(patient.height);
    const w = parseFloat(patient.weight);
    if (isNaN(h) || isNaN(w)) return 0;
    return Math.sqrt((h * w) / 3600);
  }, [patient.height, patient.weight]);

  const renderContent = () => {
    const components: Record<string, React.ReactNode> = {
      patient: <PatientInfoForm patient={patient} setPatient={setPatient} bsa={bsa} />,
      risk: <RiskStratification patient={patient} />,
      mpal: <MPALModule />,
      cnsl: <CNSLModule />,
      lasp: <LASPModule bsa={bsa} patient={patient} />,
      tls: <TLSModule patient={patient} bsa={bsa} />,
    };
    return components[activeTab] || null;
  };

  const tabs = [
    { id: 'patient', icon: User, label: '患者' },
    { id: 'risk', icon: ShieldAlert, label: '危险度' },
    { id: 'mpal', icon: Dna, label: 'MPAL' },
    { id: 'cnsl', icon: Brain, label: 'CNSL' },
    { id: 'lasp', icon: Activity, label: '凝血' },
    { id: 'tls', icon: ThermometerSnowflake, label: 'TLS' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#F2F2F7] selection:bg-blue-100">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[30%] bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[30%] bg-purple-400/10 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-50 bg-white/60 ios-blur border-b border-gray-200/50 px-4 py-5">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mb-0.5">Clinical Tool</span>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">SCCCG-ALL-2025</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-6">
        {renderContent()}
      </main>

      <nav className="fixed bottom-4 left-4 right-4 max-w-[calc(448px-2rem)] mx-auto bg-white/80 ios-blur border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[32px] px-2 py-2 z-50">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 ${
                  isActive ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
