import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home', standalone: true, imports: [RouterLink],
  template: `
    <header><p>ADMIN AREA</p><h1>Data management workspace</h1><span>Prepare operational inputs without mixing edit controls into the public dashboard.</span></header>
    <section class="admin-grid">
      <a routerLink="/admin/interventions"><b>01</b><h2>Add intervention</h2><p>Prepare corrective intervention records and durations.</p></a>
      <a routerLink="/admin/maintenance-status"><b>02</b><h2>Maintenance status</h2><p>Update annual dates and completion states.</p></a>
      <a routerLink="/admin/spare-parts"><b>03</b><h2>Spare parts</h2><p>Prepare quantity and replacement-date changes.</p></a>
      <a routerLink="/admin/excel"><b>04</b><h2>Excel management</h2><p>Validate or replace source workbooks later.</p></a>
      <a routerLink="/admin/planner"><b>05</b><h2>Project planner</h2><p>Prepare assembly timeline phases and priorities.</p></a>
    </section>
  `,
  styles: [`
    header p{margin:0 0 .35rem;color:#4f6fd5;font-size:.68rem;font-weight:900;letter-spacing:.12em}header h1{margin:0;color:#182235;font-size:clamp(1.5rem,3vw,2rem)}header span{display:block;margin-top:.45rem;color:#6b7588;font-size:.84rem}.admin-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;margin-top:1.4rem}.admin-grid a{min-height:170px;padding:1.15rem;border:1px solid #e0e5ed;border-radius:12px;background:#fff;color:inherit;text-decoration:none;box-shadow:0 8px 25px #1720330a}.admin-grid a:hover{border-color:#9db1f5;transform:translateY(-2px)}b{color:#7590e8;font-size:.7rem}h2{margin:1.8rem 0 .4rem;font-size:1rem}p{margin:0;color:#707b8d;font-size:.78rem;line-height:1.5}
  `]
})
export class AdminHomeComponent {}
