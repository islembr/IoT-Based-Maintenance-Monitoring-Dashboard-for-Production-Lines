import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface DonutSlice { label: string; value: number; color: string; }

@Component({
  selector: 'app-donut-chart', standalone: true, imports: [CommonModule],
  template: `<div class="donut-wrap">
    <svg viewBox="0 0 42 42" class="donut" role="img" aria-label="Répartition des statuts">
      <circle class="track" cx="21" cy="21" r="15.915" />
      <circle *ngFor="let seg of segments" cx="21" cy="21" r="15.915" fill="transparent"
        [attr.stroke]="seg.color" stroke-width="7" [attr.stroke-dasharray]="seg.dash" [attr.stroke-dashoffset]="seg.offset" />
      <text x="21" y="20" text-anchor="middle" class="total">{{ total }}</text>
      <text x="21" y="25" text-anchor="middle" class="sub">lignes</text>
    </svg>
    <div class="legend"><div *ngFor="let s of slices" class="legend-item">
      <i [style.background]="s.color"></i><span>{{ s.label }}</span><strong>{{ s.value }}</strong><small>{{ pct(s.value) }}%</small>
    </div></div>
  </div>`,
  styles: [`
    .donut-wrap{display:flex;align-items:center;justify-content:center;gap:2rem;flex-wrap:wrap}.donut{width:180px;height:180px;transform:rotate(-90deg)}
    circle{transition:stroke-dasharray .3s}.track{fill:transparent;stroke:#edf2ee;stroke-width:7}.total,.sub{transform:rotate(90deg);transform-origin:21px 21px;fill:#16331c}
    .total{font-size:7px;font-weight:800}.sub{font-size:3px;fill:#64756a}.legend{min-width:190px}.legend-item{display:grid;grid-template-columns:12px 1fr auto auto;gap:.55rem;align-items:center;padding:.5rem 0;border-bottom:1px solid #edf2ee}
    i{width:10px;height:10px;border-radius:50%}strong{color:#16331c}small{color:#64756a;min-width:34px;text-align:right}
  `]
})
export class DonutChartComponent {
  @Input() slices: DonutSlice[] = [];
  get total() { return this.slices.reduce((sum, item) => sum + item.value, 0); }
  get segments() { const total=this.total||1; let used=0; return this.slices.map(s=>{const part=s.value/total; const result={color:s.color,dash:`${part*100} ${100-part*100}`,offset:-used*100}; used+=part; return result;}); }
  pct(value: number) { return this.total ? Math.round(value / this.total * 100) : 0; }
}
