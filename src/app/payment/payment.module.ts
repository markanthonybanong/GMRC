import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { EntryComponent } from './payment/entry/entry.component';
import { RoomComponent } from './payment/room/room.component';
import { EntryFormComponent } from './form/entry-form/entry-form.component';
import { RoomFormComponent } from './form/room-form/room-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentStatusDirective } from '@gmrc/directives';
import {
    AngularMaterialModule,
    SharedModule,
    EntryAdvanceSearchComponent,
    RoomPaymentDialogComponent,
    RoomPaymentAdvanceSearchComponent,
    PenaltyAdvanceSearchComponent,
} from '@gmrc/shared';
import { PenaltyComponent } from './payment/penalty/penalty.component';
import { PenaltyFormComponent } from './form/penalty-form/penalty-form.component';


@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [
    PaymentComponent,
    EntryComponent,
    RoomComponent,
    PenaltyComponent,
    PenaltyFormComponent,
    EntryFormComponent,
    RoomFormComponent,
    PaymentStatusDirective,
  ],
  entryComponents: [
    EntryAdvanceSearchComponent,
    RoomPaymentDialogComponent,
    RoomPaymentAdvanceSearchComponent,
    PenaltyAdvanceSearchComponent,
  ]
})
export class PaymentModule { }
