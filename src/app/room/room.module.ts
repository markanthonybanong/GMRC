import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room/room.component';
import {
  SharedModule,
  AngularMaterialModule,
  ConfirmationDialogComponent,
  TransientPrivateAdvanceSearchComponent,
  BedspaceAdvanceSearchComponent,
  UnsettleBillAdvanceSearchComponent
} from '@gmrc/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TransientPrivateComponent } from './room/transient-private/transient-private.component';
import { BedspaceComponent } from './room/bedspace/bedspace.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { TransientPrivateFormComponent } from './form/transient-private-form/transient-private-form.component';
import { BedspaceFormComponent } from './form/bedspace-form/bedspace-form.component';
import { UnsettleBillComponent } from './room/unsettle-bill/unsettle-bill.component';
import { UnsettleBillFormComponent } from './form/unsettle-bill-form/unsettle-bill-form.component';

@NgModule({
  imports: [
    CommonModule,
    RoomRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxMaterialTimepickerModule.forRoot()
  ],
  declarations: [
    RoomComponent,
    RoomFormComponent,
    TransientPrivateComponent,
    BedspaceComponent,
    TransientPrivateFormComponent,
    BedspaceFormComponent,
    UnsettleBillComponent,
    UnsettleBillFormComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    TransientPrivateAdvanceSearchComponent,
    BedspaceAdvanceSearchComponent,
    UnsettleBillAdvanceSearchComponent
  ],
  providers: []
})
export class RoomModule {}
