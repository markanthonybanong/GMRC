import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant/tenant.component';
import { TenantFormComponent } from './tenant-form/tenant-form.component';
import { AngularMaterialModule, TenantAdvanceSearchComponent, SharedModule, UploadTenantPhotoComponent } from '@gmrc/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TenantRoutingModule,
    AngularMaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    TenantComponent,
    TenantFormComponent
  ],
  entryComponents: [TenantAdvanceSearchComponent, UploadTenantPhotoComponent],
})
export class TenantModule { }
