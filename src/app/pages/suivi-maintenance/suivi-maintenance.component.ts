import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaintenanceStatus } from '../../models/maintenance.models';
import { MaintenanceDataService } from '../../services/maintenance-data.service';
import { DonutChartComponent, DonutSlice } from '../../shared/donut-chart.component';
import { formatDateExcel, statusColor } from '../../shared/maintenance.util';

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

@Component({
  selector: 'app-suivi-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, DonutChartComponent],
  template: `
    <header class="page-header">
      <div><p class="eyebrow">Plan annuel</p><h1>Suivi de maintenance</h1><p>Échéances et périodicités par ligne.</p></div>
    </header>
    <div class="summary">
      <section class="card chart-card"><h2>Répartition des statuts</h2><app-donut-chart [slices]="slices" /></section>
      <section class="card">
        <h2>Statut par ligne</h2>
        <div class="toolbar"><input class="control" [(ngModel)]="query" placeholder="Rechercher une ligne…"><select class="control" [(ngModel)]="status"><option value="all">Tous les statuts</option><option *ngFor="let s of statuses" [value]="s">{{ s }}</option></select></div>
        <div class="table-scroll status-table"><table><thead><tr><th>Ligne</th><th>Date</th><th>Statut</th></tr></thead><tbody><tr *ngFor="let row of filtered"><td><strong>{{ row.machine }}</strong></td><td>{{ formatDate(row.annualDate) }}</td><td><span class="pill status" [style.background]="color(row.status)">{{ row.status }}</span></td></tr></tbody></table></div>
      </section>
    </div>
    <section class="card annual">
      <div><h2>Plan de Maintenance Annuel - KTR</h2><p class="muted">Couleurs extraites directement des cellules Excel B3:M23.</p></div>
      <div class="table-scroll"><table class="grid"><thead><tr><th class="sticky">Ligne</th><th *ngFor="let month of months">{{ month }}</th></tr></thead><tbody><tr *ngFor="let row of data.annualPlan"><td class="sticky"><strong>{{ row.machine }}</strong></td><td *ngFor="let shade of row.colors" [style.background]="shade"></td></tr></tbody></table></div>
      <div class="legend"><span><i style="background:#000000"></i>Mensuelle</span><span><i style="background:#FFFF00"></i>Trimestrielle</span><span><i style="background:#00B050"></i>Semestrielle</span><span><i style="background:#FF0000"></i>Annuelle</span></div>
    </section>
  `,
  styles: [`
    .summary{display:grid;grid-template-columns:minmax(300px,.8fr) 1.2fr;gap:1rem;margin-bottom:1rem}.chart-card{display:flex;flex-direction:column;justify-content:center}.status{color:#fff}.status-table{max-height:330px}.annual>div:first-child{display:flex;justify-content:space-between;align-items:center}.grid{min-width:920px}.grid th:not(.sticky),.grid td:not(.sticky){text-align:center;min-width:64px}.grid td:not(.sticky){height:30px;padding:0}.sticky{position:sticky;left:0;z-index:3;background:#fff;min-width:150px}.grid thead .sticky{z-index:4;background:#f2f7f3}.legend{display:flex;gap:1rem;flex-wrap:wrap;margin-top:.8rem;font-size:.7rem;color:#64756a}.legend span{display:flex;align-items:center;gap:.35rem}.legend i{width:12px;height:12px;border:1px solid #cbd5ce;border-radius:2px}@media(max-width:1000px){.summary{grid-template-columns:1fr}}
  `]
})
export class SuiviMaintenanceComponent {
  readonly data = inject(MaintenanceDataService);
  readonly months = MONTHS;
  readonly statuses: MaintenanceStatus[] = ['Terminé', 'Ce mois', 'Bientôt'];
  query = '';
  status = 'all';
  formatDate = formatDateExcel;
  color = statusColor;
  get slices(): DonutSlice[] { return this.data.statusCounts.map(item => ({ label: item.label, value: item.value, color: statusColor(item.label as MaintenanceStatus) })); }
  get filtered() { const q = this.query.toLowerCase(); return this.data.tracking.filter(item => (this.status === 'all' || item.status === this.status) && item.machine.toLowerCase().includes(q)); }
}
