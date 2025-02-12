import { ref } from 'vue';

export function useGradeCalculations() {
  const calculateWWPS = (record) => {
    const totalWW = record.ww1 + record.ww2 + record.ww3 + record.ww4 + record.ww5 + record.ww6 + record.ww7 + record.ww8 + record.ww9 + record.ww10;
    const maxWW = record.wwMax1 + record.wwMax2 + record.wwMax3 + record.wwMax4 + record.wwMax5 + record.wwMax6 + record.wwMax7 + record.wwMax8 + record.wwMax9 + record.wwMax10;
    return maxWW ? (totalWW / maxWW) * 100 : 0;
  };

  const calculatePTPS = (record) => {
    const totalPT = record.pt1 + record.pt2 + record.pt3 + record.pt4 + record.pt5 + record.pt6 + record.pt7 + record.pt8 + record.pt9 + record.pt10;
    const maxPT = record.ptMax1 + record.ptMax2 + record.ptMax3 + record.ptMax4 + record.ptMax5 + record.ptMax6 + record.ptMax7 + record.ptMax8 + record.ptMax9 + record.ptMax10;
    return maxPT ? (totalPT / maxPT) * 100 : 0;
  };

  const calculatePTWS = (record) => {
    const ptps = calculatePTPS(record);
    return ptps * 0.4;
  };

  const calculateQATS = (record) => {
    const maxQA = record.qaMax1;
    return maxQA ? (record.qa1 / maxQA) * 100 : 0;
  };

  const calculateQAWS = (record) => {
    const qats = calculateQATS(record);
    return qats * 0.2;
  };

  const calculateInitialGrade = (record) => {
    const wwps = calculateWWPS(record) * 0.4;
    const ptps = calculatePTPS(record) * 0.4;
    const qats = calculateQATS(record) * 0.2;
    return wwps + ptps + qats;
  };

  const calculateQuarterlyGrade = (record) => {
    return Math.round(calculateInitialGrade(record));
  };

  return {
    calculateWWPS,
    calculatePTPS,
    calculatePTWS,
    calculateQATS,
    calculateQAWS,
    calculateInitialGrade,
    calculateQuarterlyGrade
  };
}
