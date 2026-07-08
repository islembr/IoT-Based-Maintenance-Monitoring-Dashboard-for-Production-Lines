import { MaintenanceStatus } from './maintenance.models';
import { PlannerPhaseCode, PlannerStatus } from './planner.models';

export interface InterventionInput { machine: string; code: string; description: string; date: string; durationMinutes: number; }
export interface MaintenanceStatusInput { machine: string; annualDate: string; status: MaintenanceStatus; }
export interface SparePartInput { name: string; reference: string; quantity: number; replacementDate: string | null; }
export interface PlannerProjectInput { equipmentName: string; priority: number; projectCode: string; baNumber: string; status: PlannerStatus; currentPhase: PlannerPhaseCode; startYear: number; startWeek: number; endYear: number; endWeek: number; }
export interface AdminOperationResult { success: boolean; message: string; mock: boolean; }
