import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CountItem } from '../models/maintenance.models';

@Component({
  selector:'app-bar-chart', standalone:true, imports:[CommonModule],
  template:`<div class="chart" role="img" [attr.aria-label]="label">
    <div class="row" *ngFor="let item of items">
      <span class="name" [title]="item.label">{{ item.label }}</span>
      <div class="track"><div class="bar" [style.width.%]="pct(item.value)" [style.background]="color"></div></div>
      <strong>{{ item.value }}</strong>
    </div>
  </div>`,
  styles:[`.chart{display:grid;gap:.48rem;max-height:430px;overflow:auto;padding-right:.4rem}.row{display:grid;grid-template-columns:minmax(90px,150px) 1fr 26px;gap:.65rem;align-items:center}.name{font-size:.76rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#46594b}.track{height:11px;background:#edf2ee;border-radius:99px;overflow:hidden}.bar{height:100%;min-width:2px;border-radius:99px;transition:width .3s}strong{font-size:.76rem;color:#16331c;text-align:right}`]
})
export class BarChartComponent {
  @Input() items: CountItem[]=[]; @Input() color='#16a34a'; @Input() label='Graphique en barres';
  get max(){return Math.max(1,...this.items.map(item=>item.value));} pct(value:number){return value/this.max*100;}
}
