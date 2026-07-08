import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { MaintenanceDataService } from '../../services/maintenance-data.service';

@Component({
  selector:'app-admin-intervention',standalone:true,imports:[ReactiveFormsModule,NgFor,NgIf],styleUrl:'../admin-form.scss',
  template:`<section class="admin-page"><header><p>ADMIN / INTERVENTIONS</p><h1>{{editIndex===null?'Add':'Edit'}} intervention</h1><span>Manage local test records. The public history remains read-only.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="form-grid"><div class="field"><label>Production line</label><input formControlName="machine" placeholder="KTR 002"></div><div class="field"><label>Corrective code</label><input formControlName="code" placeholder="AC1"></div><div class="field full"><label>Description</label><textarea formControlName="description"></textarea></div><div class="field"><label>Intervention date</label><input type="date" formControlName="date"></div><div class="field"><label>Duration (minutes)</label><input type="number" min="1" formControlName="durationMinutes"></div></div><div class="actions"><button [disabled]="form.invalid||saving">{{saving?'Saving…':(editIndex===null?'Add intervention':'Save changes')}}</button><button type="button" class="secondary" *ngIf="editIndex!==null" (click)="cancelEdit()">Cancel</button><span class="hint">Stored in this browser session.</span></div><p class="result" *ngIf="message">{{message}}</p></form><section class="records"><h2>Intervention records</h2><div class="records-scroll"><table><thead><tr><th>Line</th><th>Code</th><th>Date</th><th>Minutes</th><th>Actions</th></tr></thead><tbody><tr *ngFor="let item of data.interventions;let i=index"><td>{{item.machine}}</td><td>{{item.code||'—'}}</td><td>{{item.date}}</td><td>{{item.durationMinutes}}</td><td class="row-actions"><button (click)="edit(i)">Edit</button><button class="delete" (click)="remove(i)">Delete</button></td></tr></tbody></table></div></section></section>`
})
export class AdminInterventionComponent{
  private readonly service=inject(AdminDataService);private readonly fb=inject(FormBuilder);readonly data=inject(MaintenanceDataService);
  readonly form=this.fb.nonNullable.group({machine:['',Validators.required],code:['',Validators.required],description:['',Validators.required],date:['',Validators.required],durationMinutes:[30,[Validators.required,Validators.min(1)]]});saving=false;message='';editIndex:number|null=null;
  submit():void{if(this.form.invalid)return;this.saving=true;this.service.createIntervention(this.form.getRawValue(),this.editIndex).subscribe(r=>{this.message=r.message;this.saving=false;this.cancelEdit(false);});}
  edit(i:number):void{const x=this.data.interventions[i];this.editIndex=i;this.form.setValue({machine:x.machine,code:x.code??'',description:x.description,date:x.date,durationMinutes:x.durationMinutes});this.message='';}
  remove(i:number):void{this.service.deleteIntervention(i).subscribe(r=>this.message=r.message);if(this.editIndex===i)this.cancelEdit();}
  cancelEdit(clear=true):void{this.editIndex=null;this.form.reset({machine:'',code:'',description:'',date:'',durationMinutes:30});if(clear)this.message='';}
}
