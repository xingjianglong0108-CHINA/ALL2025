
export interface PatientInfo {
  name: string;
  gender: 'male' | 'female' | '';
  age: string;
  height: string;
  weight: string;
  initialWbc: string;
}

export interface RiskState {
  ageRange: '1-10' | '>=10' | '<1' | '';
  wbcCount: ' <50' | ' >=50' | '';
  lineage: 'B-ALL' | 'T-ALL' | '';
  genetics: string[];
  mrd15: string;
  mrd33: string;
}
