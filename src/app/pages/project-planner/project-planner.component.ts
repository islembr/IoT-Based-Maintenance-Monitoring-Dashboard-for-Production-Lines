import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlannerPhase, PlannerPhaseCode, PlannerProject } from '../../models/planner.models';
import { PlannerDataService } from '../../services/planner-data.service';

const PHASE_LABELS: Record<PlannerPhaseCode, string> = {
  BA: 'Procurement request',
  BG: 'Order',
  LZ: 'Delivery time',
  TR: 'Transport to TUN',
  VA: 'Approval',
  IA: 'Installation',
  VB: 'Ready for production'
};

@Component({
  selector: 'app-project-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="page-header planner-header">
      <div>
        <p class="eyebrow">Production-line assembly & procurement</p>
        <h1>Project Planner</h1>
        <p>Read-only 2026–2027 schedule extracted from {{ data.sourceWorkbook }}.</p>
      </div>
      <span class="readonly-badge">Read only</span>
    </header>

    <section class="metric-grid planner-metrics">
      <article class="metric"><small>Projects</small><strong>{{ filteredProjects.length }}</strong></article>
      <article class="metric"><small>Top priority</small><strong>{{ priorityOneCount }}</strong></article>
      <article class="metric"><small>BA assigned</small><strong>{{ assignedBaCount }}</strong></article>
      <article class="metric"><small>Ready milestones</small><strong>{{ readyCount }}</strong></article>
    </section>

    <section class="card planner-card" style="margin-top:1rem">
      <div class="toolbar planner-toolbar">
        <input class="control search" [(ngModel)]="query" placeholder="Search equipment or project…">
        <select class="control" [(ngModel)]="priorityFilter">
          <option value="all">All priorities</option>
          <option *ngFor="let priority of priorities" [value]="priority">Priority {{ priority }}</option>
        </select>
        <select class="control" [(ngModel)]="phaseFilter">
          <option value="all">All current phases</option>
          <option *ngFor="let phase of currentPhases" [value]="phase">{{ phase }}</option>
        </select>
        <select class="control" [(ngModel)]="statusFilter">
          <option value="all">All statuses</option>
          <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
        </select>
        <span class="count">{{ filteredProjects.length }} of {{ data.projects.length }}</span>
      </div>

      <div class="phase-legend">
        <span *ngFor="let code of phaseCodes"><i [style.background]="phaseColor(code)"></i><b>{{ code }}</b> {{ phaseLabels[code] }}</span>
      </div>

      <div class="gantt-scroll" *ngIf="filteredProjects.length; else emptyState">
        <div class="gantt" [style.--week-count]="data.weeks.length">
          <div class="gantt-header meta-head">Project information</div>
          <div class="gantt-header timeline-head">
            <div class="year-row">
              <span *ngFor="let year of data.years">{{ year }}</span>
            </div>
            <div class="week-row">
              <span *ngFor="let week of data.weeks" [class.year-start]="week.week === 1">{{ week.week }}</span>
            </div>
          </div>

          <ng-container *ngFor="let project of filteredProjects; trackBy: trackProject">
            <article class="project-meta">
              <div class="project-title">
                <strong>{{ project.projectCode }}</strong>
                <span class="priority">P{{ project.priority }}</span>
              </div>
              <p>{{ project.equipmentName }}</p>
              <div class="project-facts">
                <span><small>BA</small>{{ project.baNumber }}</span>
                <span><small>Status</small>{{ project.status }}</span>
                <span><small>Current</small>{{ project.currentPhase }}</span>
              </div>
              <div class="progress-row">
                <div class="progress"><span [style.width.%]="project.progressPercentage"></span></div>
                <b>{{ project.progressPercentage }}%</b>
              </div>
            </article>

            <div class="timeline" [attr.aria-label]="project.projectCode + ' phase timeline'">
              <span class="week-cell" *ngFor="let week of data.weeks" [class.year-start]="week.week === 1"></span>
              <span
                *ngFor="let phase of project.phases"
                class="phase-bar"
                [class]="'phase-bar phase-' + phase.code.toLowerCase()"
                [style.grid-column]="gridColumn(phase)"
                [style.background]="phaseColor(phase.code)"
                [style.color]="phaseTextColor(phase.code)"
                [title]="phaseTitle(phase)">
                {{ phase.code }}
              </span>
            </div>
          </ng-container>
        </div>
      </div>

      <ng-template #emptyState><div class="empty">No projects match these filters.</div></ng-template>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .readonly-badge { padding: .4rem .7rem; border-radius: 999px; background: #e7f7ea; color: #19723a; font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
    .planner-card { padding: 0; overflow: hidden; }
    .planner-toolbar { padding: 1rem 1rem 0; }
    .planner-toolbar .search { min-width: 260px; }
    .phase-legend { display: flex; flex-wrap: wrap; gap: .55rem 1rem; padding: .25rem 1rem 1rem; color: #5f7065; font-size: .66rem; }
    .phase-legend span { display: inline-flex; align-items: center; gap: .3rem; }
    .phase-legend i { width: 10px; height: 10px; border-radius: 2px; }
    .gantt-scroll { overflow: auto; max-height: 68vh; border-top: 1px solid #e5ece7; }
    .gantt { --meta-width: 340px; display: grid; grid-template-columns: var(--meta-width) minmax(calc(var(--week-count) * 30px), 1fr); width: max-content; min-width: 100%; background: #fff; }
    .gantt-header { position: sticky; top: 0; z-index: 6; background: #edf5ef; border-bottom: 1px solid #cedbd1; color: #36563e; font-size: .68rem; font-weight: 800; text-transform: uppercase; }
    .meta-head { left: 0; z-index: 8; display: flex; align-items: center; padding: .8rem 1rem; border-right: 1px solid #cedbd1; }
    .timeline-head { min-width: calc(var(--week-count) * 30px); }
    .year-row, .week-row { display: grid; grid-template-columns: repeat(104, 30px); }
    .year-row span { grid-column: span 52; text-align: center; padding: .38rem; border-left: 2px solid #91a596; }
    .week-row span { display: grid; place-items: center; height: 27px; border-left: 1px solid #dce5de; font-size: .58rem; }
    .project-meta { position: sticky; left: 0; z-index: 4; min-height: 118px; padding: .85rem 1rem; background: #fff; border-right: 1px solid #d9e3db; border-bottom: 1px solid #e7eee8; }
    .project-title { display: flex; align-items: center; justify-content: space-between; gap: .5rem; color: #17351f; }
    .project-title strong { font-size: .9rem; }
    .priority { border-radius: 999px; padding: .18rem .48rem; background: #e7f7ea; color: #19723a; font-size: .62rem; font-weight: 900; }
    .project-meta p { margin: .3rem 0 .65rem; color: #637469; font-size: .72rem; }
    .project-facts { display: grid; grid-template-columns: .7fr 1.6fr .7fr; gap: .5rem; color: #2f4635; font-size: .66rem; }
    .project-facts small { display: block; color: #819087; font-size: .56rem; text-transform: uppercase; }
    .progress-row { display: flex; align-items: center; gap: .55rem; margin-top: .6rem; color: #46604d; font-size: .62rem; }
    .progress { height: 6px; flex: 1; overflow: hidden; border-radius: 99px; background: #e8eee9; }
    .progress span { display: block; height: 100%; background: #26a653; border-radius: inherit; }
    .timeline { position: relative; display: grid; grid-template-columns: repeat(104, 30px); grid-template-rows: 1fr; min-height: 118px; border-bottom: 1px solid #e7eee8; }
    .week-cell { grid-row: 1; border-left: 1px solid #edf1ee; }
    .year-start { border-left: 2px solid #91a596 !important; }
    .phase-bar { grid-row: 1; z-index: 2; align-self: center; display: grid; place-items: center; height: 32px; margin: 0 2px; border-radius: 6px; color: #102d1b; font-size: .65rem; font-weight: 900; box-shadow: inset 0 0 0 1px #17351f22; }
    @media (max-width: 900px) {
      .planner-toolbar .control { min-width: 145px; }
      .planner-toolbar .search { min-width: 100%; }
      .gantt { --meta-width: 285px; }
      .project-facts { grid-template-columns: 1fr 1fr; }
      .project-facts span:nth-child(2) { grid-column: span 2; }
    }
  `]
})
export class ProjectPlannerComponent {
  readonly data = inject(PlannerDataService);
  readonly phaseCodes: PlannerPhaseCode[] = ['BA', 'BG', 'LZ', 'TR', 'VA', 'IA', 'VB'];
  readonly phaseLabels = PHASE_LABELS;
  readonly phaseColors: Record<PlannerPhaseCode, string> = { BA: '#969696', BG: '#5f5f5f', LZ: '#20a65a', TR: '#ef4444', VA: '#f59e0b', IA: '#19b8ec', VB: '#fff0b8' };
  readonly priorities = [...new Set(this.data.projects.map(project => project.priority))].sort((a, b) => a - b);
  readonly currentPhases = [...new Set(this.data.projects.map(project => project.currentPhase))];
  readonly statuses = [...new Set(this.data.projects.map(project => project.status))];

  query = '';
  priorityFilter = 'all';
  phaseFilter = 'all';
  statusFilter = 'all';

  get filteredProjects(): PlannerProject[] {
    const query = this.query.trim().toLowerCase();
    return this.data.projects.filter(project =>
      (!query || `${project.equipmentName} ${project.projectCode} ${project.baNumber}`.toLowerCase().includes(query)) &&
      (this.priorityFilter === 'all' || project.priority === Number(this.priorityFilter)) &&
      (this.phaseFilter === 'all' || project.currentPhase === this.phaseFilter) &&
      (this.statusFilter === 'all' || project.status === this.statusFilter)
    );
  }

  get priorityOneCount(): number { return this.filteredProjects.filter(project => project.priority === 1).length; }
  get assignedBaCount(): number { return this.filteredProjects.filter(project => project.baNumber !== 'TBD').length; }
  get readyCount(): number { return this.filteredProjects.filter(project => project.phases.some(phase => phase.code === 'VB')).length; }

  gridColumn(phase: PlannerPhase): string {
    return `${phase.startIndex + 1} / ${phase.endIndex + 2}`;
  }

  phaseTitle(phase: PlannerPhase): string {
    const start = `${phase.startYear} W${phase.startWeek}`;
    const end = `${phase.endYear} W${phase.endWeek}`;
    return `${phase.code} — ${PHASE_LABELS[phase.code]} — ${start}${start === end ? '' : ` to ${end}`}`;
  }

  phaseColor(code: PlannerPhaseCode): string { return this.phaseColors[code]; }
  phaseTextColor(code: PlannerPhaseCode): string { return ['BG', 'LZ', 'TR'].includes(code) ? '#ffffff' : '#102d1b'; }

  trackProject(_: number, project: PlannerProject): string { return project.id; }
}
