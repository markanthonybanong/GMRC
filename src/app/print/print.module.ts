import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectricBillsComponent } from './print/electric-bills/electric-bills.component';
 import { AngularMaterialModule, SharedModule } from '@gmrc/shared';
import { PrintComponent } from './print/print.component';
import { RoomBillsComponent } from './print/room-bills/room-bills.component';
import { PromisoryNoteComponent } from './print/promisory-note/promisory-note.component';
import { PrintRoutingModule } from './print-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    PrintRoutingModule,
    SharedModule
  ],
  declarations: [RoomBillsComponent, ElectricBillsComponent, PromisoryNoteComponent, PrintComponent]
})
export class PrintModule { }
