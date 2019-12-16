import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant/tenant.component';
import { TenantFormComponent } from './tenant-form/tenant-form.component';
import { AngularMaterialModule, TenantAdvanceSearchComponent, SharedModule } from '@gmrc/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  imports: [
    CommonModule,
    TenantRoutingModule,
    AngularMaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    WebcamModule
  ],
  declarations: [TenantComponent, TenantFormComponent],
  entryComponents: [TenantAdvanceSearchComponent],
})
export class TenantModule { }
