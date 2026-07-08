export type PlannerPhaseCode = 'BA' | 'BG' | 'LZ' | 'TR' | 'VA' | 'IA' | 'VB';
export type PlannerCurrentPhase = PlannerPhaseCode | 'Not started';
export type PlannerStatus = 'On schedule' | 'Delayed without impact' | 'Delayed with impact' | 'Available';

export interface PlannerPhase {
  code: PlannerPhaseCode;
  startWeek: number;
  endWeek: number;
  startYear: number;
  endYear: number;
  startIndex: number;
  endIndex: number;
}

export interface PlannerProject {
  id: string;
  equipmentName: string;
  priority: number;
  projectCode: string;
  baNumber: string;
  status: PlannerStatus;
  currentPhase: PlannerCurrentPhase;
  progressPercentage: number;
  phases: PlannerPhase[];
}

export interface PlannerProjectSource extends Omit<PlannerProject, 'currentPhase' | 'progressPercentage'> {}

export interface PlannerWeek {
  index: number;
  year: number;
  week: number;
  label: string;
}

export interface PlannerMonth {
  name: string;
  year: number;
  startIndex: number;
  weekSpan: number;
}
