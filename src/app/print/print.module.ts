import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectricBillsComponent } from './print/electric-bills/electric-bills.component';
import { AngularMaterialModule, SharedModule } from '@gmrc/shared';
import { PrintComponent } from './print/print.component';
import { RoomBillsComponent } from './print/room-bills/room-bills.component';
import { PromisoryNoteComponent } from './print/promisory-note/promisory-note.component';
import { PrintRoutingModule } from './print-routing.module';
import { UnpaidBalanceTenantsComponent } from './print/unpaid-balance-tenants/unpaid-balance-tenants.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TenantsComponent } from './print/unpaid-balance-tenants/tenants/tenants.component';
import { NoteComponent } from './print/promisory-note/note/note.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    PrintRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    RoomBillsComponent,
    ElectricBillsComponent,
    PromisoryNoteComponent,
    PrintComponent,
    UnpaidBalanceTenantsComponent,
    TenantsComponent,
    NoteComponent
  ]
})
export class PrintModule { }
