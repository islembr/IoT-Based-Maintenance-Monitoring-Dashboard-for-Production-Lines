import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { MaintenanceDataService } from '../../services/maintenance-data.service';

@Component({
  selector:'app-admin-spare-parts',standalone:true,imports:[ReactiveFormsModule,NgFor,NgIf],styleUrl:'../admin-form.scss',
  template:`<section class="admin-page"><header><p>ADMIN / INVENTORY</p><h1>{{editIndex===null?'Add':'Edit'}} spare part</h1><span>Manage local part references, quantities and replacement dates.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="form-grid"><div class="field"><label>Part name</label><input formControlName="name"></div><div class="field"><label>Reference</label><input formControlName="reference"></div><div class="field"><label>Quantity</label><input type="number" min="0" formControlName="quantity"></div><div class="field"><label>Replacement date</label><input type="date" formControlName="replacementDate"></div></div><div class="actions"><button [disabled]="form.invalid||saving">{{saving?'Saving…':(editIndex===null?'Add part':'Save changes')}}</button><button type="button" class="secondary" *ngIf="editIndex!==null" (click)="cancelEdit()">Cancel</button></div><p class="result" *ngIf="message">{{message}}</p></form><section class="records"><h2>Spare parts</h2><div class="records-scroll"><table><thead><tr><th>Name</th><th>Reference</th><th>Quantity</th><th>Actions</th></tr></thead><tbody><tr *ngFor="let item of data.spareParts;let i=index"><td>{{item.name}}</td><td>{{item.reference||'—'}}</td><td>{{item.quantity}}</td><td class="row-actions"><button (click)="edit(i)">Edit</button><button class="delete" (click)="remove(i)">Delete</button></td></tr></tbody></table></div></section></section>`
})
export class AdminSparePartsComponent{
  private readonly service=inject(AdminDataService);private readonly fb=inject(FormBuilder);readonly data=inject(MaintenanceDataService);
  readonly form=this.fb.nonNullable.group({name:['',Validators.required],reference:['',Validators.required],quantity:[0,[Validators.required,Validators.min(0)]],replacementDate:['']});saving=false;message='';editIndex:number|null=null;
  submit():void{if(this.form.invalid)return;this.saving=true;const raw=this.form.getRawValue();this.service.upsertSparePart({...raw,replacementDate:raw.replacementDate||null},this.editIndex).subscribe(r=>{this.message=r.message;this.saving=false;this.cancelEdit(false);});}
  edit(i:number):void{const x=this.data.spareParts[i];this.editIndex=i;this.form.setValue({name:x.name,reference:x.reference??'',quantity:x.quantity,replacementDate:x.replacementDate??''});this.message='';}
  remove(i:number):void{this.service.deleteSparePart(i).subscribe(r=>this.message=r.message);if(this.editIndex===i)this.cancelEdit();}
  cancelEdit(clear=true):void{this.editIndex=null;this.form.reset({name:'',reference:'',quantity:0,replacementDate:''});if(clear)this.message='';}
}
