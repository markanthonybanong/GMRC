import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomBillsComponent } from './room-bills/room-bills.component';
import { ElectricBillsComponent } from './electric-bills/electric-bills.component';
import { PromisoryNoteComponent } from './promisory-note/promisory-note.component';
import { AngularMaterialModule } from '@gmrc/shared';
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
  ],
  declarations: [RoomBillsComponent, ElectricBillsComponent, PromisoryNoteComponent]
})
export class PrintModule { }
