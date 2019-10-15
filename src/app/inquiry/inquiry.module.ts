import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule, ConfirmationDialogComponent, InquiryAdvanceSearchComponent, SharedModule } from '@gmrc/shared';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { InquiryComponent } from './inquiry/inquiry.component';
import { InquiryFormComponent } from './inquiry-form/inquiry-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InquiryRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  declarations: [InquiryComponent, InquiryFormComponent],
  entryComponents: [ConfirmationDialogComponent, InquiryAdvanceSearchComponent]
})
export class InquiryModule { }
