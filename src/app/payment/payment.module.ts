import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { EntryComponent } from './payment/entry/entry.component';
import { RoomComponent } from './payment/room/room.component';
import { EntryFormComponent } from './form/entry-form/entry-form.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { PenaltiesFormComponent } from './form/penalties-form/penalties-form.component';
import { PenaltiesComponent } from './payment/penalties/penalties.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentStatusDirective } from '@gmrc/directives';
import {
    AngularMaterialModule,
    SharedModule,
    EntryAdvanceSearchComponent,
    RoomPaymentDialogComponent,
    RoomPaymentAdvanceSearchComponent,
} from '@gmrc/shared';
import { PrintModule } from '../print/print.module';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PrintModule,
  ],
  declarations: [
    PaymentComponent,
    EntryComponent,
    RoomComponent,
    EntryFormComponent,
    RoomFormComponent,
    PenaltiesFormComponent,
    PenaltiesComponent,
    PaymentStatusDirective,
  ],
  entryComponents: [
    EntryAdvanceSearchComponent,
    RoomPaymentDialogComponent,
    RoomPaymentAdvanceSearchComponent,
  ]
})
export class PaymentModule { }
