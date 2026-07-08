import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaintenanceDataService } from '../services/maintenance-data.service';

interface DashboardLink { label: string; icon: string; path: string; exact?: boolean; }

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly data = inject(MaintenanceDataService);
  readonly links: DashboardLink[] = [
    { label: 'Accueil', icon: '⌂', path: '/dashboard', exact: true },
    { label: 'KPI par chaîne', icon: '▥', path: '/dashboard/kpi' },
    { label: 'Actions', icon: '⚙', path: '/dashboard/actions' },
    { label: 'Suivi annuel', icon: '◫', path: '/dashboard/maintenance' },
    { label: 'Plan hebdomadaire', icon: '▦', path: '/dashboard/weekly-plan' },
    { label: 'Project Planner', icon: '▤', path: '/dashboard/project-planner' },
    { label: 'Interventions', icon: '↻', path: '/dashboard/interventions' },
    { label: 'Statistiques', icon: '↗', path: '/dashboard/statistics' },
    { label: 'Parc innovation', icon: '▤', path: '/dashboard/innovation' },
    { label: 'Responsabilité', icon: '✓', path: '/dashboard/responsibility' },
    { label: 'Pièces de rechange', icon: '◇', path: '/dashboard/spare-parts' }
  ];
  menuOpen = false;

  closeMenu(): void { this.menuOpen = false; }
  refresh(): void { void this.data.refresh(); }
}
