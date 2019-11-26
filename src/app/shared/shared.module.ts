import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { LoadingComponent } from './loading/loading.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { TenantAdvanceSearchComponent } from './advanced-search-dialogs/tenant-advance-search/tenant-advance-search.component';
// tslint:disable-next-line: max-line-length
import { TransientPrivateAdvanceSearchComponent } from './advanced-search-dialogs/transient-private-advance-search/transient-private-advance-search.component';
import { BedspaceAdvanceSearchComponent } from './advanced-search-dialogs/bedspace-advance-search/bedspace-advance-search.component';
import { InquiryAdvanceSearchComponent } from './advanced-search-dialogs/inquiry-advance-search/inquiry-advance-search.component';
import { EntryAdvanceSearchComponent } from './advanced-search-dialogs/entry-advance-search/entry-advance-search.component';
import { RoomPaymentDialogComponent } from './room-payment-dialog/room-payment-dialog.component';
// tslint:disable-next-line: max-line-length
import { RoomPaymentAdvanceSearchComponent } from './advanced-search-dialogs/room-payment-advance-search/room-payment-advance-search.component';
import { UnsettleBillAdvanceSearchComponent } from './advanced-search-dialogs/unsettle-bill-advance-search/unsettle-bill-advance-search.component';
import { PenaltyAdvanceSearchComponent } from './advanced-search-dialogs/penalty-advance-search/penalty-advance-search.component';


// TODO: use the ts config.
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [LoadingComponent],

  declarations: [
    LoadingComponent,
    ConfirmationDialogComponent,
    TenantAdvanceSearchComponent,
    TransientPrivateAdvanceSearchComponent,
    BedspaceAdvanceSearchComponent,
    InquiryAdvanceSearchComponent,
    EntryAdvanceSearchComponent,
    RoomPaymentDialogComponent,
    RoomPaymentAdvanceSearchComponent,
    UnsettleBillAdvanceSearchComponent,
    PenaltyAdvanceSearchComponent,
  ],

  providers: []
})
export class SharedModule {}
