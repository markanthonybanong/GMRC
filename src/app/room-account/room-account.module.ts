import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomAccountRoutingModule } from './room-account-routing.module';
import { RoomAccountComponent } from './room-account/room-account.component';
import { RoomAccountFormComponent } from './room-account-form/room-account-form.component';
import { AngularMaterialModule } from '@gmrc/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RoomAccountRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [RoomAccountComponent, RoomAccountFormComponent]
})
export class RoomAccountModule { }
