import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AdminOperationResult, InterventionInput, MaintenanceStatusInput, PlannerProjectInput, SparePartInput, WorkbookUploadInput } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  readonly mockMode = true;

  createIntervention(payload: InterventionInput): Observable<AdminOperationResult> {
    return this.mock(`Intervention for ${payload.machine} prepared.`);
    // Future: return this.http.post<AdminOperationResult>('/api/admin/interventions', payload);
  }

  updateMaintenanceStatus(payload: MaintenanceStatusInput): Observable<AdminOperationResult> {
    return this.mock(`${payload.machine} status prepared as ${payload.status}.`);
  }

  upsertSparePart(payload: SparePartInput): Observable<AdminOperationResult> {
    return this.mock(`${payload.name} quantity update prepared.`);
  }

  uploadWorkbook(payload: WorkbookUploadInput): Observable<AdminOperationResult> {
    return this.mock(`${payload.file.name} selected for ${payload.replaceCurrent ? 'replacement' : 'validation'}.`);
  }

  upsertPlannerProject(payload: PlannerProjectInput): Observable<AdminOperationResult> {
    return this.mock(`${payload.projectCode} planner update prepared.`);
  }

  deleteIntervention(id: string): Observable<AdminOperationResult> {
    return this.mock(`Delete intervention ${id} prepared.`);
  }

  deleteSparePart(reference: string): Observable<AdminOperationResult> {
    return this.mock(`Delete spare part ${reference} prepared.`);
  }

  private mock(message: string): Observable<AdminOperationResult> {
    return of({ success: true, message: `${message} Mock mode: no data was changed.`, mock: true }).pipe(delay(250));
  }
}
