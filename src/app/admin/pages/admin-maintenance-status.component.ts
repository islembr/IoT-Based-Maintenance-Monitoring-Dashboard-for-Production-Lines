import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector:'app-admin-maintenance-status',standalone:true,imports:[ReactiveFormsModule,NgIf],styleUrl:'../admin-form.scss',
  template:`<section class="admin-page"><header><p>ADMIN / MAINTENANCE</p><h1>Edit maintenance status</h1><span>Prepare an annual maintenance date or status update.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="form-grid"><div class="field"><label>Production line</label><input formControlName="machine" placeholder="KTR 002"></div><div class="field"><label>Annual maintenance date</label><input type="date" formControlName="annualDate"></div><div class="field full"><label>Status</label><select formControlName="status"><option value="Terminé">Terminé</option><option value="Ce mois">Ce mois</option><option value="Bientôt">Bientôt</option></select></div></div><div class="actions"><button [disabled]="form.invalid||saving">{{saving?'Preparing…':'Prepare status update'}}</button><span class="hint">Future PUT /api/admin/maintenance-status</span></div><p class="result" *ngIf="message">{{message}}</p></form></section>`
})
export class AdminMaintenanceStatusComponent{
  private readonly service=inject(AdminDataService);private readonly fb=inject(FormBuilder);
  readonly form=this.fb.nonNullable.group({machine:['',Validators.required],annualDate:['',Validators.required],status:['Ce mois' as const,Validators.required]});saving=false;message='';
  submit():void{if(this.form.invalid)return;this.saving=true;this.service.updateMaintenanceStatus(this.form.getRawValue()).subscribe(r=>{this.message=r.message;this.saving=false;});}
}
