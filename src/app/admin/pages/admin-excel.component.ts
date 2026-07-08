import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector:'app-admin-excel',standalone:true,imports:[ReactiveFormsModule,NgIf],styleUrl:'../admin-form.scss',
  template:`<section class="admin-page"><header><p>ADMIN / EXCEL</p><h1>Workbook management</h1><span>Select and validate an Excel source file. Upload is mocked until an admin API exists.</span></header><form class="form-card" [formGroup]="form" (ngSubmit)="submit()"><div class="file-box"><div class="field"><label>Excel workbook</label><input type="file" accept=".xlsx,.xlsm" (change)="selectFile($event)"><span class="hint">Accepted: .xlsx and .xlsm. Selected: {{file?.name||'none'}}</span></div></div><div class="field full" style="margin-top:1rem"><label class="checkbox"><input type="checkbox" formControlName="replaceCurrent">Replace the current workbook after validation</label></div><div class="actions"><button [disabled]="!file||saving">{{saving?'Validating…':'Prepare workbook upload'}}</button><span class="hint">No file is transmitted in mock mode.</span></div><p class="result" *ngIf="message">{{message}}</p></form></section>`
})
export class AdminExcelComponent{
  private readonly service=inject(AdminDataService);private readonly fb=inject(FormBuilder);readonly form=this.fb.nonNullable.group({replaceCurrent:[false]});file:File|null=null;saving=false;message='';
  selectFile(event:Event):void{this.file=(event.target as HTMLInputElement).files?.[0]??null;this.message='';}
  submit():void{if(!this.file)return;this.saving=true;this.service.uploadWorkbook({file:this.file,replaceCurrent:this.form.controls.replaceCurrent.value}).subscribe(r=>{this.message=r.message;this.saving=false;});}
}
