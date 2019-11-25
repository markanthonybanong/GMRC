import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { TransientPrivateComponent } from './room/transient-private/transient-private.component';
import { BedspaceComponent } from './room/bedspace/bedspace.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { TransientPrivateFormComponent } from './form/transient-private-form/transient-private-form.component';
import { BedspaceFormComponent } from './form/bedspace-form/bedspace-form.component';
import { UnsettleBillComponent} from './room/unsettle-bill/unsettle-bill.component';
import { UnsettleBillFormComponent } from './form/unsettle-bill-form/unsettle-bill-form.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    children: [
      { path: '', redirectTo: 'private-transient', pathMatch: 'full' },
      { path: 'private-transient', component: TransientPrivateComponent },
      { path: 'bedspace', component: BedspaceComponent },
      { path: 'unsettle-bill', component: UnsettleBillComponent}
    ]
  },
  { path: 'add', component: RoomFormComponent },
  { path: 'update-private-transient/:id', component: TransientPrivateFormComponent },
  { path: 'update-bedspace/:id', component: BedspaceFormComponent },
  { path: 'unsettle-bill/add', component: UnsettleBillFormComponent },
  { path: 'update-unsettle-bill/:id', component: UnsettleBillFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
