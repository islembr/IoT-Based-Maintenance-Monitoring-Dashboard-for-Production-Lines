import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <aside>
        <a class="admin-brand" routerLink="/admin"><span>AM</span><div><strong>Admin workspace</strong><small>Mock input mode</small></div></a>
        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Overview</a>
          <a routerLink="/admin/interventions" routerLinkActive="active">Interventions</a>
          <a routerLink="/admin/maintenance-status" routerLinkActive="active">Maintenance status</a>
          <a routerLink="/admin/spare-parts" routerLinkActive="active">Spare parts</a>
          <a routerLink="/admin/excel" routerLinkActive="active">Excel management</a>
          <a routerLink="/admin/planner" routerLinkActive="active">Project planner</a>
        </nav>
        <a class="back" routerLink="/dashboard">← Public dashboard</a>
      </aside>
      <main><div class="mock-banner">UI preparation mode — submissions are not persisted.</div><router-outlet /></main>
    </div>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:#f6f7f9;color:#1e293b}.admin-layout{min-height:100vh;display:grid;grid-template-columns:240px minmax(0,1fr)}aside{position:sticky;top:0;height:100vh;padding:1.2rem;background:#172033;color:#fff;display:flex;flex-direction:column}.admin-brand{display:flex;align-items:center;gap:.7rem;color:#fff;text-decoration:none;padding:.4rem .3rem 1.2rem;border-bottom:1px solid #ffffff1c}.admin-brand>span{display:grid;place-items:center;width:40px;height:40px;border-radius:10px;background:#4f7cff;font-weight:900}.admin-brand strong,.admin-brand small{display:block}.admin-brand small{margin-top:.15rem;color:#9ca9c1;font-size:.66rem}nav{display:grid;gap:.25rem;margin-top:1.1rem}nav a,.back{padding:.7rem .8rem;border-radius:8px;color:#bdc8db;text-decoration:none;font-size:.8rem}nav a:hover,nav a.active{background:#ffffff12;color:#fff}nav a.active{box-shadow:inset 3px 0 #6f91ff}.back{margin-top:auto;border:1px solid #ffffff1c}main{min-width:0;padding:1.7rem 2rem}.mock-banner{margin-bottom:1rem;padding:.65rem .85rem;border:1px solid #f7d58b;background:#fff8e7;color:#8b5b00;border-radius:8px;font-size:.72rem;font-weight:700}@media(max-width:760px){.admin-layout{grid-template-columns:1fr}aside{position:relative;height:auto;padding:1rem}nav{grid-template-columns:repeat(2,minmax(0,1fr))}.back{margin-top:.8rem}main{padding:1rem}}
  `]
})
export class AdminShellComponent {}
