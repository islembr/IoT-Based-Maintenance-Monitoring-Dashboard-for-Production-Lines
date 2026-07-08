import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaintenanceStatus } from '../../models/maintenance.models';
import { AdminDataService } from '../../services/admin-data.service';
import { MaintenanceDataService } from '../../services/maintenance-data.service';

@Component({
  selector:'app-admin-maintenance-status',standalone:true,imports:[ReactiveFormsModule,NgFor,NgIf],styleUrl:'../admin-form.scss',
  template:`<section class="admin-page"><header><p>ADMIN / MAINTENANCE</p><h1>{{editIndex===null?'Add':'Edit'}} maintenance status</h1><span>Manage local annual dates and statuses.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="form-grid"><div class="field"><label>Production line</label><input formControlName="machine" placeholder="KTR 002"></div><div class="field"><label>Annual maintenance date</label><input type="date" formControlName="annualDate"></div><div class="field full"><label>Status</label><select formControlName="status"><option value="Terminé">Terminé</option><option value="Ce mois">Ce mois</option><option value="Bientôt">Bientôt</option></select></div></div><div class="actions"><button [disabled]="form.invalid||saving">{{saving?'Saving…':(editIndex===null?'Add status':'Save changes')}}</button><button type="button" class="secondary" *ngIf="editIndex!==null" (click)="cancelEdit()">Cancel</button></div><p class="result" *ngIf="message">{{message}}</p></form><section class="records"><h2>Maintenance statuses</h2><div class="records-scroll"><table><thead><tr><th>Line</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr *ngFor="let item of data.tracking;let i=index"><td>{{item.machine}}</td><td>{{item.annualDate}}</td><td>{{item.status}}</td><td class="row-actions"><button (click)="edit(i)">Edit</button><button class="delete" (click)="remove(i)">Delete</button></td></tr></tbody></table></div></section></section>`
})
export class AdminMaintenanceStatusComponent{
  private readonly service=inject(AdminDataService);private readonly fb=inject(FormBuilder);readonly data=inject(MaintenanceDataService);
  readonly form=this.fb.nonNullable.group({machine:['',Validators.required],annualDate:['',Validators.required],status:['Ce mois' as MaintenanceStatus,Validators.required]});saving=false;message='';editIndex:number|null=null;
  submit():void{if(this.form.invalid)return;this.saving=true;this.service.updateMaintenanceStatus(this.form.getRawValue(),this.editIndex).subscribe(r=>{this.message=r.message;this.saving=false;this.cancelEdit(false);});}
  edit(i:number):void{const x=this.data.tracking[i];this.editIndex=i;this.form.setValue({machine:x.machine,annualDate:x.annualDate,status:x.status});this.message='';}
  remove(i:number):void{this.service.deleteMaintenanceStatus(i).subscribe(r=>this.message=r.message);if(this.editIndex===i)this.cancelEdit();}
  cancelEdit(clear=true):void{this.editIndex=null;this.form.reset({machine:'',annualDate:'',status:'Ce mois'});if(clear)this.message='';}
}
