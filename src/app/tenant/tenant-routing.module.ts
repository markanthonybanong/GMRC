import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantComponent } from './tenant/tenant.component';
import { TenantFormComponent } from './tenant-form/tenant-form.component';

const routes: Routes = [
  { path: '', component: TenantComponent },
  { path: 'add', component: TenantFormComponent },
  { path: 'update/:id', component: TenantFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantRoutingModule { }
