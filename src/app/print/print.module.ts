import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectricBillsComponent } from './print/electric-bills/electric-bills.component';
import { AngularMaterialModule, SharedModule } from '@gmrc/shared';
import { PrintComponent } from './print/print.component';
import { RoomBillsComponent } from './print/room-bills/room-bills.component';
import { PromisoryNoteComponent } from './print/promisory-note/promisory-note.component';
import { PrintRoutingModule } from './print-routing.module';
import {NgxPrintModule} from 'ngx-print';
import { UnpaidBalanceTenantsComponent } from './print/unpaid-balance-tenants/unpaid-balance-tenants.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TenantsComponent } from './print/unpaid-balance-tenants/tenants/tenants.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    PrintRoutingModule,
    SharedModule,
    NgxPrintModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [RoomBillsComponent, ElectricBillsComponent, PromisoryNoteComponent, PrintComponent, UnpaidBalanceTenantsComponent, TenantsComponent]
})
export class PrintModule { }
