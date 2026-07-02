import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ActionMaintenanceComponent } from './pages/action-maintenance/action-maintenance.component';
import { FabriqueServiceComponent } from './pages/fabrique-service/fabrique-service.component';
import { InsertionInterventionComponent } from './pages/insertion-intervention/insertion-intervention.component';
import { KpiChaineComponent } from './pages/kpi-chaine/kpi-chaine.component';
import { NombreInterventionsComponent } from './pages/nombre-interventions/nombre-interventions.component';
import { PiecesRechangeComponent } from './pages/pieces-rechange/pieces-rechange.component';
import { PlanHebdomadaireComponent } from './pages/plan-hebdomadaire/plan-hebdomadaire.component';
import { ResponsabiliteComponent } from './pages/responsabilite/responsabilite.component';
import { SuiviMaintenanceComponent } from './pages/suivi-maintenance/suivi-maintenance.component';

interface Tab { id: string; label: string; icon: string; }
@Component({selector:'app-root',standalone:true,imports:[CommonModule,AccueilComponent,KpiChaineComponent,ActionMaintenanceComponent,SuiviMaintenanceComponent,PlanHebdomadaireComponent,InsertionInterventionComponent,NombreInterventionsComponent,FabriqueServiceComponent,ResponsabiliteComponent,PiecesRechangeComponent],templateUrl:'./app.component.html',styleUrl:'./app.component.scss'})
export class AppComponent {
  readonly tabs: Tab[]=[
    {id:'accueil',label:'Accueil',icon:'⌂'},{id:'kpi',label:'KPI par chaîne',icon:'▥'},{id:'actions',label:'Actions',icon:'⚙'},
    {id:'suivi',label:'Suivi annuel',icon:'◫'},{id:'plan',label:'Plan hebdomadaire',icon:'▦'},{id:'insertion',label:'Interventions',icon:'↻'},
    {id:'nombre',label:'Statistiques',icon:'↗'},{id:'fabrique',label:'Parc innovation',icon:'▤'},{id:'responsabilite',label:'Responsabilité',icon:'✓'},{id:'pieces',label:'Pièces de rechange',icon:'◇'}
  ];
  active='accueil'; menuOpen=false;
  setActive(id:string){this.active=id;this.menuOpen=false;}
}
