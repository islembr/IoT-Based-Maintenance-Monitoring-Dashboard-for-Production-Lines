import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector:'app-admin-spare-parts',standalone:true,imports:[ReactiveFormsModule,NgIf],styleUrl:'../admin-form.scss',
  template:`<section class="admin-page"><header><p>ADMIN / INVENTORY</p><h1>Spare parts input</h1><span>Prepare a new part or update an existing reference and quantity.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="form-grid"><div class="field"><label>Part name</label><input formControlName="name" placeholder="Bearing"></div><div class="field"><label>Reference</label><input formControlName="reference" placeholder="REF-001"></div><div class="field"><label>Quantity</label><input type="number" min="0" formControlName="quantity"></div><div class="field"><label>Replacement date (optional)</label><input type="date" formControlName="replacementDate"></div></div><div class="actions"><button [disabled]="form.invalid||saving">{{saving?'Preparing…':'Prepare part update'}}</button><span class="hint">Future POST/PUT endpoint.</span></div><p class="result" *ngIf="message">{{message}}</p></form></section>`
})
export class AdminSparePartsComponent{
  private readonly service=inject(AdminDataService);private readonly fb=inject(FormBuilder);
  readonly form=this.fb.nonNullable.group({name:['',Validators.required],reference:['',Validators.required],quantity:[0,[Validators.required,Validators.min(0)]],replacementDate:['']});saving=false;message='';
  submit():void{if(this.form.invalid)return;this.saving=true;const raw=this.form.getRawValue();this.service.upsertSparePart({...raw,replacementDate:raw.replacementDate||null}).subscribe(r=>{this.message=r.message;this.saving=false;});}
}
