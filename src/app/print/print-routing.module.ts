import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintComponent } from './print/print.component';
import { RoomBillsComponent } from './print/room-bills/room-bills.component';
import { ElectricBillsComponent } from './print/electric-bills/electric-bills.component';
import { PromisoryNoteComponent } from './print/promisory-note/promisory-note.component';




const routes: Routes = [
  {
    path: '',
    component: PrintComponent,
    children: [
      { path: '', redirectTo: 'room-bills', pathMatch: 'full' },
      { path: 'room-bills', component: RoomBillsComponent },
      { path: 'electric-bills', component: ElectricBillsComponent },
      { path: 'promisory-note', component: PromisoryNoteComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }
