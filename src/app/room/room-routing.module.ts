import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { TransientPrivateComponent } from './room/transient-private/transient-private.component';
import { BedspaceComponent } from './room/bedspace/bedspace.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { TransientPrivateFormComponent } from './form/transient-private-form/transient-private-form.component';
import { BedspaceFormComponent } from './form/bedspace-form/bedspace-form.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    children: [
      { path: '', redirectTo: 'private-transient', pathMatch: 'full' },
      { path: 'private-transient', component: TransientPrivateComponent },
      { path: 'bedspace', component: BedspaceComponent }
    ]
  },
  { path: 'add', component: RoomFormComponent },
  { path: 'update-private-transient/:id', component: TransientPrivateFormComponent },
  { path: 'update-bedspace/:id', component: BedspaceFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
