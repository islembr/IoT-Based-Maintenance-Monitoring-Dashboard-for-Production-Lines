import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard-shell.component').then(component => component.DashboardShellComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/accueil/accueil.component').then(component => component.AccueilComponent) },
      { path: 'kpi', loadComponent: () => import('./pages/kpi-chaine/kpi-chaine.component').then(component => component.KpiChaineComponent) },
      { path: 'maintenance', loadComponent: () => import('./pages/suivi-maintenance/suivi-maintenance.component').then(component => component.SuiviMaintenanceComponent) },
      { path: 'project-planner', loadComponent: () => import('./pages/project-planner/project-planner.component').then(component => component.ProjectPlannerComponent) },
      { path: 'actions', loadComponent: () => import('./pages/action-maintenance/action-maintenance.component').then(component => component.ActionMaintenanceComponent) },
      { path: 'weekly-plan', loadComponent: () => import('./pages/plan-hebdomadaire/plan-hebdomadaire.component').then(component => component.PlanHebdomadaireComponent) },
      { path: 'interventions', loadComponent: () => import('./pages/insertion-intervention/insertion-intervention.component').then(component => component.InsertionInterventionComponent) },
      { path: 'statistics', loadComponent: () => import('./pages/nombre-interventions/nombre-interventions.component').then(component => component.NombreInterventionsComponent) },
      { path: 'innovation', loadComponent: () => import('./pages/fabrique-service/fabrique-service.component').then(component => component.FabriqueServiceComponent) },
      { path: 'responsibility', loadComponent: () => import('./pages/responsabilite/responsabilite.component').then(component => component.ResponsabiliteComponent) },
      { path: 'spare-parts', loadComponent: () => import('./pages/pieces-rechange/pieces-rechange.component').then(component => component.PiecesRechangeComponent) }
    ]
  },
  {
    path: 'admin',
    canActivateChild: [adminGuard],
    loadComponent: () => import('./admin/admin-shell.component').then(component => component.AdminShellComponent),
    children: [
      { path: '', loadComponent: () => import('./admin/pages/admin-home.component').then(component => component.AdminHomeComponent) },
      { path: 'interventions', loadComponent: () => import('./admin/pages/admin-intervention.component').then(component => component.AdminInterventionComponent) },
      { path: 'maintenance-status', loadComponent: () => import('./admin/pages/admin-maintenance-status.component').then(component => component.AdminMaintenanceStatusComponent) },
      { path: 'spare-parts', loadComponent: () => import('./admin/pages/admin-spare-parts.component').then(component => component.AdminSparePartsComponent) },
      { path: 'excel', loadComponent: () => import('./admin/pages/admin-excel.component').then(component => component.AdminExcelComponent) },
      { path: 'planner', loadComponent: () => import('./admin/pages/admin-planner.component').then(component => component.AdminPlannerComponent) }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
