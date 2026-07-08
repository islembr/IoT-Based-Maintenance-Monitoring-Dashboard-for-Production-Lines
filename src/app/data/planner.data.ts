import { PlannerPhase, PlannerPhaseCode, PlannerProjectSource } from '../models/planner.models';

const phase = (
  code: PlannerPhaseCode,
  startYear: number,
  startWeek: number,
  endYear = startYear,
  endWeek = startWeek
): PlannerPhase => ({
  code,
  startYear,
  startWeek,
  endYear,
  endWeek,
  startIndex: (startYear - 2026) * 52 + startWeek - 1,
  endIndex: (endYear - 2026) * 52 + endWeek - 1
});

const project = (
  id: string,
  equipmentName: string,
  priority: number,
  projectCode: string,
  baNumber: string,
  phases: PlannerPhase[]
): PlannerProjectSource => ({
  id,
  equipmentName,
  priority,
  projectCode,
  baNumber,
  status: 'On schedule',
  phases
});

export const PLANNER_PROJECTS: PlannerProjectSource[] = [
  project('P01', 'KTR 6-Stations (150*80)', 1, 'PAG983', '260560', [phase('BA', 2026, 26), phase('BG', 2026, 27), phase('IA', 2026, 40, 2026, 42), phase('VB', 2026, 43)]),
  project('P02', 'KTR 6-Stations (150*80)', 2, 'PAG983', '260560', [phase('BA', 2026, 26), phase('BG', 2026, 27), phase('IA', 2026, 43, 2026, 45), phase('VB', 2026, 46)]),
  project('P03', 'KTR 6-Stations (220*80)', 3, 'AMG.EA Stoss', '260549', [phase('BA', 2026, 26), phase('BG', 2026, 27), phase('IA', 2026, 46, 2026, 48), phase('VB', 2026, 49)]),
  project('P04', 'KTR 6-Stations (220*80)', 4, 'AMG.EA Stoss', '260549', [phase('BA', 2026, 26), phase('BG', 2026, 27), phase('IA', 2026, 50), phase('IA', 2027, 1, 2027, 2), phase('VB', 2027, 3)]),
  project('P05', 'KTR 6-Stations (220*80)', 1, 'AMG.EA Dach', '260549', [phase('BA', 2026, 26), phase('BG', 2026, 27), phase('IA', 2027, 3, 2027, 5), phase('VB', 2027, 6)]),
  project('P06', 'KTR 6-Stations (220*80)', 2, 'AMG.EA Dach', '260549', [phase('BA', 2026, 26), phase('BG', 2026, 27), phase('IA', 2027, 6, 2027, 8), phase('VB', 2027, 9)]),
  project('P07', 'KTR 6-Stations (150*80)', 7, 'AMG M177 EVO M5', 'TBD', [phase('IA', 2027, 9, 2027, 11), phase('VB', 2027, 12)]),
  project('P08', 'KTR 6-Stations (150*80)', 8, 'AMG HPEB', 'TBD', [phase('IA', 2027, 12, 2027, 14), phase('VB', 2027, 15)]),
  project('P09', 'KTR 6-Stations (150*80)', 9, 'AMG.EA MIKO', 'TBD', [phase('IA', 2027, 15, 2027, 17), phase('VB', 2027, 18)]),
  project('P10', 'Modal 6-Stations', 10, 'AMG.EA Sitz', 'TBD', [phase('IA', 2027, 18, 2027, 19), phase('VB', 2027, 20)]),
  project('P11', 'Modal 6-Stations', 11, 'AMG.EA Sitz', 'TBD', [phase('IA', 2027, 20, 2027, 21), phase('VB', 2027, 22)]),
  project('P12', 'Modal 6-Stations', 12, 'AMG.EA Sitz', 'TBD', [phase('IA', 2027, 22, 2027, 23), phase('VB', 2027, 24)]),
  project('P13', 'Modal 6-Stations', 13, 'AMG.EA Tuer', 'TBD', [phase('IA', 2027, 24, 2027, 25), phase('VB', 2027, 26)]),
  project('P14', 'Modal 6-Stations', 14, 'AMG.EA Tuer', 'TBD', [phase('IA', 2027, 26, 2027, 27), phase('VB', 2027, 28)]),
  project('P15', 'Modal 6-Stations', 15, 'AMG.EA Tuer', 'TBD', [phase('IA', 2027, 28, 2027, 29), phase('VB', 2027, 30)]),
  project('P16', 'Modal 6-Stations', 16, 'AMG.EA Tuer', 'TBD', [phase('IA', 2027, 30, 2027, 31), phase('VB', 2027, 32)]),
  project('P17', 'Modal 6-Stations', 17, 'AMG.EA Tuer', 'TBD', [phase('IA', 2027, 32, 2027, 33), phase('VB', 2027, 34)]),
  project('P18', 'Modal 6-Stations', 18, 'AMG.EA Tuer', 'TBD', [phase('IA', 2027, 34, 2027, 35), phase('VB', 2027, 36)]),
  project('P19', 'KTR 6-Stations (150*80)', 9, 'TM2025', 'TBD', [phase('IA', 2027, 36, 2027, 38), phase('VB', 2027, 39)])
];
