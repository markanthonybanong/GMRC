import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryComponent } from './payment/entry/entry.component';
import { PaymentComponent } from './payment/payment.component';
import { RoomComponent } from './payment/room/room.component';
import { PenaltiesComponent } from './payment/penalties/penalties.component';
import { EntryFormComponent } from './form/entry-form/entry-form.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { PenaltiesFormComponent } from './form/penalties-form/penalties-form.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      { path: '', redirectTo: 'entry', pathMatch: 'full' },
      { path: 'entry', component: EntryComponent },
      { path: 'room', component: RoomComponent },
      { path: 'penalties', component: PenaltiesComponent },
    ]
  },
  { path: 'add-entry', component: EntryFormComponent },
  { path: 'update-entry/:id', component: EntryFormComponent },
  { path: 'add-room-payment', component: RoomFormComponent },
  { path: 'update-room-payment/:id', component: RoomFormComponent },
  { path: 'add-penalties', component: PenaltiesFormComponent },
  { path: 'update-panalties', component: PenaltiesFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
