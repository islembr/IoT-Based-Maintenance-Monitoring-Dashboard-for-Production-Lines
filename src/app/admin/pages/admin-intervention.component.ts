import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-admin-intervention', standalone: true, imports: [ReactiveFormsModule, NgIf], styleUrl: '../admin-form.scss',
  template: `<section class="admin-page"><header><p>ADMIN / INTERVENTIONS</p><h1>Add intervention</h1><span>Prepare a corrective intervention record. The public history remains read-only.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="form-grid"><div class="field"><label>Production line</label><input formControlName="machine" placeholder="KTR 002"></div><div class="field"><label>Corrective code</label><input formControlName="code" placeholder="AC1"></div><div class="field full"><label>Description</label><textarea formControlName="description" placeholder="Describe the intervention"></textarea></div><div class="field"><label>Intervention date</label><input type="date" formControlName="date"></div><div class="field"><label>Duration (minutes)</label><input type="number" min="1" formControlName="durationMinutes"></div></div><div class="actions"><button [disabled]="form.invalid || saving">{{saving?'Preparing…':'Prepare intervention'}}</button><span class="hint">Mock mode — no workbook changes.</span></div><p class="result" *ngIf="message">{{message}}</p></form></section>`
})
export class AdminInterventionComponent {
  private readonly service = inject(AdminDataService); private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({ machine: ['', Validators.required], code: ['', Validators.required], description: ['', Validators.required], date: ['', Validators.required], durationMinutes: [30, [Validators.required, Validators.min(1)]] });
  saving=false; message='';
  submit():void{if(this.form.invalid)return;this.saving=true;this.service.createIntervention(this.form.getRawValue()).subscribe(result=>{this.message=result.message;this.saving=false;});}
}
