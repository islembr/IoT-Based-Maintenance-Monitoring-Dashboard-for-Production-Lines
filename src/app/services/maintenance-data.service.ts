import { Injectable } from '@angular/core';
import { MAINTENANCE_DATA } from '../data/maintenance-data.generated';
import { CountItem, MaintenanceDataset, MaintenanceStatus } from '../models/maintenance.models';

@Injectable({ providedIn: 'root' })
export class MaintenanceDataService {
  private readonly data: MaintenanceDataset = MAINTENANCE_DATA;

  readonly tracking = this.data.tracking;
  readonly preventiveActions = this.data.preventiveActions;
  readonly correctiveActions = this.data.correctiveActions;
  readonly kpis = this.data.kpis;
  readonly kpiParameters = this.data.kpiParameters;
  readonly weeks = this.data.weeks;
  readonly weeklyPlan = this.data.weeklyPlan;
  readonly weeklyStatus = this.data.weeklyStatus;
  readonly interventions = this.data.interventions;
  readonly factoryMachines = this.data.factoryMachines;
  readonly responsibilityMachines = this.data.responsibilityMachines;
  readonly spareParts = this.data.spareParts;
  readonly homeTasks = this.data.homeTasks;

  readonly statusCounts: CountItem[] = (['Terminé', 'Ce mois', 'Bientôt'] as MaintenanceStatus[])
    .map(label => ({ label, value: this.tracking.filter(row => row.status === label).length }));

  readonly interventionCountsByMachine: CountItem[] = this.tracking.map(row => ({
    label: row.machine,
    value: this.interventions.filter(item => item.machine === row.machine).length,
  }));

  readonly interventionCountsByCode: CountItem[] = this.correctiveActions.map(action => ({
    label: action.code,
    value: this.interventions.filter(item => item.code === action.code).length,
  }));

  trackingFor(machine: string) { return this.tracking.find(item => item.machine === machine); }
  tasksFor(machine: string) { return this.homeTasks.find(item => item.machine === machine)?.tasks ?? '—'; }
}
