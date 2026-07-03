import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AnnualPlanRow, CorrectiveAction, CountItem, HomeTask, Intervention, KpiParameter, KpiRow, MachineAsset, MaintenanceTracking, PreventiveAction, SparePart, WeeklyPlanRow } from '../models/maintenance.models';

interface AccueilResponse { homeTasks: HomeTask[]; selectedMachine: string; currentWeek: string; }
interface KpiResponse { kpis: KpiRow[]; kpiParameters: KpiParameter[]; }
interface ActionsResponse { preventiveActions: PreventiveAction[]; correctiveActions: CorrectiveAction[]; }
interface SuiviResponse { tracking: MaintenanceTracking[]; annualPlan: AnnualPlanRow[]; statusCounts: CountItem[]; }
interface PlanResponse { weeks: string[]; weeklyPlan: WeeklyPlanRow[]; weeklyStatus: (string | number | null)[]; }
interface InterventionsResponse { interventions: Intervention[]; }
interface CountsResponse { byMachine: CountItem[]; byCode: CountItem[]; }
interface FactoryResponse { factoryMachines: MachineAsset[]; }
interface ResponsibilityResponse { responsibilityMachines: MachineAsset[]; }
interface PartsResponse { spareParts: SparePart[]; totalQuantity: number; }
interface SummaryResponse { workbook: string; updatedAt: string; trackedLines: number; interventions: number; spareParts: number; statuses: CountItem[]; }

@Injectable({ providedIn: 'root' })
export class MaintenanceDataService {
  private readonly http = inject(HttpClient);
  readonly tracking: MaintenanceTracking[] = [];
  readonly annualPlan: AnnualPlanRow[] = [];
  readonly preventiveActions: PreventiveAction[] = [];
  readonly correctiveActions: CorrectiveAction[] = [];
  readonly kpis: KpiRow[] = [];
  readonly kpiParameters: KpiParameter[] = [];
  readonly weeks: string[] = [];
  readonly weeklyPlan: WeeklyPlanRow[] = [];
  readonly weeklyStatus: (string | number | null)[] = [];
  readonly interventions: Intervention[] = [];
  readonly factoryMachines: MachineAsset[] = [];
  readonly responsibilityMachines: MachineAsset[] = [];
  readonly spareParts: SparePart[] = [];
  readonly homeTasks: HomeTask[] = [];
  readonly statusCounts: CountItem[] = [];
  readonly interventionCountsByMachine: CountItem[] = [];
  readonly interventionCountsByCode: CountItem[] = [];
  loading = false;
  error = '';
  workbookName = '';
  lastUpdated = '';
  currentWeek = '';

  async loadAll(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const result = await firstValueFrom(forkJoin({
        accueil: this.http.get<AccueilResponse>('/api/accueil'), kpi: this.http.get<KpiResponse>('/api/kpi'),
        actions: this.http.get<ActionsResponse>('/api/actions'), suivi: this.http.get<SuiviResponse>('/api/suivi-maintenance'),
        plan: this.http.get<PlanResponse>('/api/plan-hebdomadaire'), interventions: this.http.get<InterventionsResponse>('/api/interventions'),
        counts: this.http.get<CountsResponse>('/api/nombre-interventions'), factory: this.http.get<FactoryResponse>('/api/fabrique-innovation'),
        responsibility: this.http.get<ResponsibilityResponse>('/api/chaines-responsabilite'), parts: this.http.get<PartsResponse>('/api/pieces-rechange'),
        summary: this.http.get<SummaryResponse>('/api/dashboard-summary'),
      }));
      this.replace(this.homeTasks, result.accueil.homeTasks); this.currentWeek = result.accueil.currentWeek;
      this.replace(this.kpis, result.kpi.kpis); this.replace(this.kpiParameters, result.kpi.kpiParameters);
      this.replace(this.preventiveActions, result.actions.preventiveActions); this.replace(this.correctiveActions, result.actions.correctiveActions);
      this.replace(this.tracking, result.suivi.tracking); this.replace(this.annualPlan, result.suivi.annualPlan); this.replace(this.statusCounts, result.suivi.statusCounts);
      this.replace(this.weeks, result.plan.weeks); this.replace(this.weeklyPlan, result.plan.weeklyPlan); this.replace(this.weeklyStatus, result.plan.weeklyStatus);
      this.replace(this.interventions, result.interventions.interventions); this.replace(this.interventionCountsByMachine, result.counts.byMachine); this.replace(this.interventionCountsByCode, result.counts.byCode);
      this.replace(this.factoryMachines, result.factory.factoryMachines); this.replace(this.responsibilityMachines, result.responsibility.responsibilityMachines); this.replace(this.spareParts, result.parts.spareParts);
      this.workbookName = result.summary.workbook; this.lastUpdated = result.summary.updatedAt;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Impossible de lire le classeur Excel.';
    } finally { this.loading = false; }
  }
  refresh() { return this.loadAll(); }
  trackingFor(machine: string) { return this.tracking.find(item => item.machine === machine); }
  tasksFor(machine: string) { return this.homeTasks.find(item => item.machine === machine)?.tasks ?? '—'; }
  private replace<T>(target: T[], source: T[]) { target.splice(0, target.length, ...source); }
}
