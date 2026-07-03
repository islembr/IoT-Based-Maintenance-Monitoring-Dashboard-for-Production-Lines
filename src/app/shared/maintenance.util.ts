import { MaintenanceStatus, Periodicity } from '../models/maintenance.models';

export const PERIODICITY_COLORS: Record<Periodicity, string> = {
  Mensuelle: '#94a3b8', Trimestrielle: '#f59e0b', Semestrielle: '#22c55e', Annuelle: '#ef4444',
};
export const STATUS_COLORS: Record<MaintenanceStatus, string> = {
  'Terminé': '#16a34a', 'Ce mois': '#dc2626', 'Bientôt': '#f59e0b',
};

export function statusColor(status: MaintenanceStatus): string { return STATUS_COLORS[status] ?? '#64748b'; }

const PERIODS: Record<string, Periodicity> = {};
for (let i = 1; i <= 7; i++) PERIODS[`A${i}`] = 'Mensuelle';
for (let i = 8; i <= 11; i++) PERIODS[`A${i}`] = 'Trimestrielle';
for (let i = 12; i <= 17; i++) PERIODS[`A${i}`] = 'Semestrielle';
for (let i = 18; i <= 21; i++) PERIODS[`A${i}`] = 'Annuelle';
const RANK: Record<Periodicity, number> = { Mensuelle: 0, Trimestrielle: 1, Semestrielle: 2, Annuelle: 3 };

export function cellPeriodicity(tasks?: string | null): Periodicity | null {
  if (!tasks || tasks === '-') return null;
  return tasks.match(/A?\d+/g)?.map(code => PERIODS[`A${code.replace(/\D/g, '')}`]).filter(Boolean)
    .sort((a, b) => RANK[b] - RANK[a])[0] ?? null;
}
export function cellColor(tasks?: string | null): string {
  const p = cellPeriodicity(tasks);
  return p ? PERIODICITY_COLORS[p] : '#f1f5f9';
}
export function formatDateFr(iso?: string | null): string {
  if (!iso) return '—';
  const [date] = iso.split(' ');
  const [y, m, d] = date.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}
export function formatDateExcel(iso?: string | null): string {
  if (!iso) return '—';
  const [date] = iso.split(' ');
  const [y, m, d] = date.split('-');
  return y && m && d ? `${m}-${d}-${y.slice(-2)}` : iso;
}
