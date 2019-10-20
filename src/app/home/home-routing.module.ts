import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { RoomModule } from '../room/room.module';
import { TenantModule } from '../tenant/tenant.module';
import { InquiryModule } from '../inquiry/inquiry.module';
import { AuthGuardService } from '@gmrc/services';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'inquiry', loadChildren: () => InquiryModule, canActivate: [AuthGuardService] },
      { path: 'room', loadChildren: () => RoomModule, canActivate: [AuthGuardService] },
      { path: 'tenant', loadChildren: () => TenantModule, canActivate: [AuthGuardService] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
