import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaintenanceDataService } from '../../services/maintenance-data.service';

@Component({
  selector: 'app-plan-hebdomadaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="page-header">
      <div>
        <p class="eyebrow">SW1 — SW52</p>
        <h1>Plan hebdomadaire</h1>
        <p>Les 52 semaines du classeur, avec filtre par ligne et plage.</p>
      </div>
    </header>

    <section class="card">
      <div class="toolbar">
        <input class="control" [(ngModel)]="query" placeholder="Rechercher une ligne…">
        <select class="control" [(ngModel)]="quarter">
          <option value="all">Toute l'année</option>
          <option value="1">SW1–SW13</option>
          <option value="2">SW14–SW26</option>
          <option value="3">SW27–SW39</option>
          <option value="4">SW40–SW52</option>
        </select>
        <span class="count">{{ filteredRows.length }} lignes · {{ visibleWeeks.length }} semaines</span>
      </div>

      <div class="table-scroll plan">
        <table>
          <thead>
            <tr>
              <th class="sticky">Ligne de production</th>
              <th *ngFor="let week of visibleWeeks">{{ week.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of filteredRows">
              <td class="sticky"><strong>{{ row.machine }}</strong></td>
              <td
                *ngFor="let week of visibleWeeks"
                [style.background]="weekColor(week.index)"
                [title]="weekTitle(week.index, row.tasks[week.index])">
                <span>{{ row.tasks[week.index] || '—' }}</span>
              </td>
            </tr>
            <tr class="status-row">
              <td class="sticky"><strong>Statut Excel</strong></td>
              <td
                *ngFor="let week of visibleWeeks"
                [style.background]="weekColor(week.index)"
                [title]="weekTitle(week.index)">
                {{ statusLabel(week.index) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="legend" aria-label="Légende des statuts Excel">
        <span><i class="completed"></i>Semaine réalisée (1)</span>
        <span><i class="pending"></i>Semaine non réalisée (0)</span>
        <span><i class="leave"></i>Congé</span>
      </div>
    </section>
  `,
  styles: [`
    .plan { max-height: 72vh; }
    .plan table { width: max-content; min-width: 100%; }
    .plan td:not(.sticky), .plan th:not(.sticky) { min-width: 88px; text-align: center; }
    .plan td:not(.sticky) { font-size: .68rem; font-weight: 700; color: #14251a; }
    .sticky { position: sticky; left: 0; z-index: 3; background: #fff; min-width: 165px; }
    .plan thead .sticky { z-index: 4; background: #f2f7f3; }
    .status-row td:not(.sticky) { color: #14251a; font-size: .75rem; font-weight: 800; }
    .legend { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: .9rem; font-size: .7rem; color: #64756a; }
    .legend span { display: flex; align-items: center; gap: .35rem; }
    .legend i { width: 12px; height: 12px; border: 1px solid #54635a; border-radius: 2px; }
    .legend .completed { background: #c7f1d5; }
    .legend .pending { background: #ffcaca; }
    .legend .leave { background: #ffe3ad; }
  `]
})
export class PlanHebdomadaireComponent {
  readonly data = inject(MaintenanceDataService);
  query = '';
  quarter = 'all';

  get filteredRows() {
    const query = this.query.trim().toLowerCase();
    return this.data.weeklyPlan.filter(row => row.machine.toLowerCase().includes(query));
  }

  get visibleWeeks() {
    const start = this.quarter === 'all' ? 0 : (Number(this.quarter) - 1) * 13;
    const end = this.quarter === 'all' ? 52 : start + 13;
    return this.data.weeks.map((label, index) => ({ label, index })).slice(start, end);
  }

  weekColor(index: number): string {
    const status = this.data.weeklyStatus[index];
    if (this.isLeave(status)) return '#ffe3ad';
    if (Number(status) === 1) return '#c7f1d5';
    if (Number(status) === 0) return '#ffcaca';
    return '#dfe4ea';
  }

  statusLabel(index: number): string {
    const status = this.data.weeklyStatus[index];
    if (this.isLeave(status)) return 'congé';
    if (Number(status) === 1) return '1';
    if (Number(status) === 0) return '0';
    return '—';
  }

  weekTitle(index: number, task?: string | null): string {
    const label = this.data.weeks[index] ?? `SW${index + 1}`;
    const status = this.statusLabel(index);
    return task ? `${label} · ${task} · statut ${status}` : `${label} · statut ${status}`;
  }

  private isLeave(value: string | number | null | undefined): boolean {
    return String(value ?? '').toLowerCase().includes('cong');
  }
}
