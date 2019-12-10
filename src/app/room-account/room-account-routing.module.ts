import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomAccountComponent } from './room-account/room-account.component';
import { RoomAccountFormComponent } from './room-account-form/room-account-form.component';

const routes: Routes = [
  {path: '', component: RoomAccountComponent},
  {path: 'add', component: RoomAccountFormComponent},
  {path: 'update/:id', component: RoomAccountFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomAccountRoutingModule { }
