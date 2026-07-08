import { Injectable } from '@angular/core';
import { PLANNER_PROJECTS } from '../data/planner.data';
import { PlannerCurrentPhase, PlannerMonth, PlannerPhaseCode, PlannerProject, PlannerProjectSource, PlannerWeek } from '../models/planner.models';

const PHASE_SEQUENCE: PlannerPhaseCode[] = ['BA', 'BG', 'LZ', 'TR', 'VA', 'IA', 'VB'];

@Injectable({ providedIn: 'root' })
export class PlannerDataService {
  readonly sourceWorkbook = 'Band Aufbauplan KH V02.xlsx';
  readonly years = [2026, 2027];
  readonly weeks: PlannerWeek[] = this.years.flatMap(year =>
    Array.from({ length: 52 }, (_, weekIndex) => ({
      index: (year - 2026) * 52 + weekIndex,
      year,
      week: weekIndex + 1,
      label: `W${weekIndex + 1}`
    }))
  );
  readonly months: PlannerMonth[] = this.years.flatMap(year => {
    const names = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const spans = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5];
    let offset = (year - 2026) * 52;
    return names.map((name, index) => {
      const month = { name, year, startIndex: offset, weekSpan: spans[index] };
      offset += spans[index];
      return month;
    });
  });
  readonly projects: PlannerProject[] = PLANNER_PROJECTS.map(project => this.withCalculatedState(project));

  private withCalculatedState(project: PlannerProjectSource): PlannerProject {
    const currentIndex = this.currentTimelineIndex();
    const sorted = [...project.phases].sort((a, b) => a.startIndex - b.startIndex);
    const latest = [...sorted].reverse().find(item => item.startIndex <= currentIndex);
    const finalPhase = sorted.at(-1);
    const isComplete = finalPhase?.code === 'VB' && currentIndex >= finalPhase.endIndex;
    const currentPhase: PlannerCurrentPhase = isComplete ? 'VB' : latest?.code ?? 'Not started';
    const progressPercentage = isComplete
      ? 100
      : currentPhase === 'Not started'
        ? 0
        : Math.round(((PHASE_SEQUENCE.indexOf(currentPhase) + 1) / PHASE_SEQUENCE.length) * 100);

    return { ...project, currentPhase, progressPercentage };
  }

  private currentTimelineIndex(): number {
    const now = new Date();
    const year = now.getFullYear();
    if (year < 2026) return -1;
    if (year > 2027) return 104;
    return (year - 2026) * 52 + this.isoWeek(now) - 1;
  }

  private isoWeek(date: Date): number {
    const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
