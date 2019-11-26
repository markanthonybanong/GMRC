import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryComponent } from './payment/entry/entry.component';
import { PaymentComponent } from './payment/payment.component';
import { RoomComponent } from './payment/room/room.component';
import { EntryFormComponent } from './form/entry-form/entry-form.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { PenaltyComponent } from './payment/penalty/penalty.component';
import { PenaltyFormComponent } from './form/penalty-form/penalty-form.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      { path: '', redirectTo: 'entry', pathMatch: 'full' },
      { path: 'entry', component: EntryComponent },
      { path: 'room', component: RoomComponent },
      { path: 'penalty', component: PenaltyComponent },
    ]
  },
  { path: 'add-entry', component: EntryFormComponent },
  { path: 'update-entry/:id', component: EntryFormComponent },
  { path: 'add-room-payment', component: RoomFormComponent },
  { path: 'update-room-payment/:id', component: RoomFormComponent },
  { path: 'add-penalty', component: PenaltyFormComponent },
  { path: 'update-penalty/:id', component: PenaltyFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
