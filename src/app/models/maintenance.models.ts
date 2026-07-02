export type MaintenanceStatus = 'Terminé' | 'Ce mois' | 'Bientôt';
export type Periodicity = 'Mensuelle' | 'Trimestrielle' | 'Semestrielle' | 'Annuelle';

export interface MaintenanceTracking { machine: string; annualDate: string; status: MaintenanceStatus; }
export interface PreventiveAction { code: string; description: string; periodicity: Periodicity; }
export interface CorrectiveAction { code: string; description: string; documented: boolean; }
export interface KpiRow { machine: string; failures: number; downtimeHours: number; theoreticalHours: number; operatingHours: number; mttrHours: number; mtbfHours: number; availability: number; }
export interface KpiParameter { label: string; value: number; unit: string; }
export interface WeeklyPlanRow { machine: string; tasks: (string | null)[]; }
export interface Intervention { machine: string; code: string | null; description: string; date: string; month: string; durationMinutes: number; durationHours: number; }
export interface MachineAsset { machine: string; type: string; number: string; constructionYear: number; location: string | null; site: string; }
export interface SparePart { name: string; reference: string | null; quantity: number; replacementDate: string | null; }
export interface HomeTask { machine: string; tasks: string; }
export interface CountItem { label: string; value: number; }

export interface MaintenanceDataset {
  tracking: MaintenanceTracking[];
  preventiveActions: PreventiveAction[];
  correctiveActions: CorrectiveAction[];
  kpis: KpiRow[];
  kpiParameters: KpiParameter[];
  weeks: string[];
  weeklyPlan: WeeklyPlanRow[];
  weeklyStatus: (string | number | null)[];
  interventions: Intervention[];
  factoryMachines: MachineAsset[];
  responsibilityMachines: MachineAsset[];
  spareParts: SparePart[];
  homeTasks: HomeTask[];
}
