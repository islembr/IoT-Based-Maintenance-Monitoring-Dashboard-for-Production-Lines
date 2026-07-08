import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AdminOperationResult, InterventionInput, MaintenanceStatusInput, PlannerProjectInput, SparePartInput } from '../models/admin.models';
import { Intervention, MaintenanceTracking, SparePart } from '../models/maintenance.models';
import { PlannerPhaseCode, PlannerProject } from '../models/planner.models';
import { MaintenanceDataService } from './maintenance-data.service';
import { PlannerDataService } from './planner-data.service';

const PHASE_SEQUENCE: PlannerPhaseCode[] = ['BA', 'BG', 'LZ', 'TR', 'VA', 'IA', 'VB'];

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly maintenance = inject(MaintenanceDataService);
  private readonly planner = inject(PlannerDataService);
  private readonly keys = {
    interventions: 'admin-test-interventions', tracking: 'admin-test-tracking',
    parts: 'admin-test-spare-parts', planner: 'admin-test-planner'
  };

  createIntervention(payload: InterventionInput, editIndex: number | null = null): Observable<AdminOperationResult> {
    const date = new Date(`${payload.date}T00:00:00`);
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const item: Intervention = { ...payload, month: month.charAt(0).toUpperCase() + month.slice(1), durationHours: payload.durationMinutes / 60 };
    this.upsertAt(this.maintenance.interventions, item, editIndex);
    this.persist(this.keys.interventions, this.maintenance.interventions);
    return this.result(editIndex === null ? 'Intervention added locally.' : 'Intervention updated locally.');
  }

  deleteIntervention(index: number): Observable<AdminOperationResult> {
    this.maintenance.interventions.splice(index, 1);
    this.persist(this.keys.interventions, this.maintenance.interventions);
    return this.result('Intervention deleted locally.');
  }

  updateMaintenanceStatus(payload: MaintenanceStatusInput, editIndex: number | null = null): Observable<AdminOperationResult> {
    const item: MaintenanceTracking = { machine: payload.machine.trim(), annualDate: payload.annualDate, status: payload.status };
    this.upsertAt(this.maintenance.tracking, item, editIndex);
    this.persist(this.keys.tracking, this.maintenance.tracking);
    return this.result(editIndex === null ? 'Maintenance status added locally.' : 'Maintenance status updated locally.');
  }

  deleteMaintenanceStatus(index: number): Observable<AdminOperationResult> {
    this.maintenance.tracking.splice(index, 1);
    this.persist(this.keys.tracking, this.maintenance.tracking);
    return this.result('Maintenance status deleted locally.');
  }

  upsertSparePart(payload: SparePartInput, editIndex: number | null = null): Observable<AdminOperationResult> {
    const item: SparePart = { name: payload.name.trim(), reference: payload.reference.trim() || null, quantity: payload.quantity, replacementDate: payload.replacementDate };
    this.upsertAt(this.maintenance.spareParts, item, editIndex);
    this.persist(this.keys.parts, this.maintenance.spareParts);
    return this.result(editIndex === null ? 'Spare part added locally.' : 'Spare part updated locally.');
  }

  deleteSparePart(index: number): Observable<AdminOperationResult> {
    this.maintenance.spareParts.splice(index, 1);
    this.persist(this.keys.parts, this.maintenance.spareParts);
    return this.result('Spare part deleted locally.');
  }

  upsertPlannerProject(payload: PlannerProjectInput, editIndex: number | null = null): Observable<AdminOperationResult> {
    const startIndex = (payload.startYear - 2026) * 52 + payload.startWeek - 1;
    const endIndex = (payload.endYear - 2026) * 52 + payload.endWeek - 1;
    const progressPercentage = Math.round(((PHASE_SEQUENCE.indexOf(payload.currentPhase) + 1) / PHASE_SEQUENCE.length) * 100);
    const item: PlannerProject = {
      id: editIndex === null ? `ADMIN-${Date.now()}` : this.planner.projects[editIndex]?.id ?? `ADMIN-${Date.now()}`,
      equipmentName: payload.equipmentName.trim(), priority: payload.priority, projectCode: payload.projectCode.trim(),
      baNumber: payload.baNumber.trim(), status: payload.status, currentPhase: payload.currentPhase, progressPercentage,
      phases: [{ code: payload.currentPhase, startYear: payload.startYear, startWeek: payload.startWeek, endYear: payload.endYear, endWeek: payload.endWeek, startIndex, endIndex }]
    };
    this.upsertAt(this.planner.projects, item, editIndex);
    this.persist(this.keys.planner, this.planner.projects);
    return this.result(editIndex === null ? 'Planner project added locally.' : 'Planner project updated locally.');
  }

  deletePlannerProject(index: number): Observable<AdminOperationResult> {
    this.planner.projects.splice(index, 1);
    this.persist(this.keys.planner, this.planner.projects);
    return this.result('Planner project deleted locally.');
  }

  private upsertAt<T>(target: T[], item: T, index: number | null): void {
    if (index !== null && index >= 0 && index < target.length) target.splice(index, 1, item);
    else target.push(item);
  }

  restoreSessionState(): void {
    this.restore(this.keys.interventions, this.maintenance.interventions);
    this.restore(this.keys.tracking, this.maintenance.tracking);
    this.restore(this.keys.parts, this.maintenance.spareParts);
    this.restore(this.keys.planner, this.planner.projects);
  }

  private restore<T>(key: string, target: T[]): void {
    try { const value = sessionStorage.getItem(key); if (value) target.splice(0, target.length, ...JSON.parse(value) as T[]); } catch { sessionStorage.removeItem(key); }
  }

  private persist<T>(key: string, value: T[]): void { sessionStorage.setItem(key, JSON.stringify(value)); }
  private result(message: string): Observable<AdminOperationResult> { return of({ success: true, message, mock: true }).pipe(delay(120)); }
}
