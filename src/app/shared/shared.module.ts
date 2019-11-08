import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { LoadingComponent } from './loading/loading.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { TenantAdvanceSearchComponent } from './advanced-search-dialogs/tenant-advance-search/tenant-advance-search.component';
import {
        TransientPrivateAdvanceSearchComponent
       } from './advanced-search-dialogs/transient-private-advance-search/transient-private-advance-search.component';
import { BedspaceAdvanceSearchComponent } from './advanced-search-dialogs/bedspace-advance-search/bedspace-advance-search.component';
import { InquiryAdvanceSearchComponent } from './advanced-search-dialogs/inquiry-advance-search/inquiry-advance-search.component';
import { EntryAdvanceSearchComponent } from './advanced-search-dialogs/entry-advance-search/entry-advance-search.component';
import { RoomPaymentDialogComponent } from './room-payment-dialog/room-payment-dialog.component';
import {
        RoomPaymentAdvanceSearchComponent
       } from './advanced-search-dialogs/room-payment-advance-search/room-payment-advance-search.component';
import { PromissoryNoteDialogComponent } from './print-dialog/promissory-note-dialog/promissory-note-dialog.component';
import { ElectricBillDialogComponent } from './print-dialog/electric-bill-dialog/electric-bill-dialog.component';
import { BillsDialogComponent } from './print-dialog/bills-dialog/bills-dialog.component';

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
    PromissoryNoteDialogComponent,
    ElectricBillDialogComponent,
    BillsDialogComponent,
  ],

  providers: []
})
export class SharedModule {}
