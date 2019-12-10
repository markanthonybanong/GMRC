import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { RoomModule } from '../room/room.module';
import { TenantModule } from '../tenant/tenant.module';
import { InquiryModule } from '../inquiry/inquiry.module';
import { AuthGuardService } from '@gmrc/services';
import { PaymentModule } from '../payment/payment.module';
import { PrintModule } from '../print/print.module';
import { RoomBillsComponent } from '../print/print/room-bills/room-bills.component';
import { TenantsComponent } from '../print/print/unpaid-balance-tenants/tenants/tenants.component';
import { ElectricBillsComponent } from '../print/print/electric-bills/electric-bills.component';
import { NoteComponent } from '../print/print/promisory-note/note/note.component';
import { PhotoComponent } from '../photo/photo/photo.component';
import { RoomAccountModule } from '../room-account/room-account.module';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'inquiry', loadChildren: () => InquiryModule, canActivate: [AuthGuardService] },
      { path: 'room', loadChildren: () => RoomModule, canActivate: [AuthGuardService] },
      { path: 'tenant', loadChildren: () => TenantModule, canActivate: [AuthGuardService] },
      { path: 'payment', loadChildren: () => PaymentModule, canActivate: [AuthGuardService] },
      { path: 'print', loadChildren: () => PrintModule, canActivate: [AuthGuardService] },
      { path: 'room-account', loadChildren: () => RoomAccountModule, canActivate: [AuthGuardService] },

      { path: 'photo', component: PhotoComponent, canActivate: [AuthGuardService] },
    ]
  },
  {
    path: 'print/room-bills',
    canActivate: [AuthGuardService],
    component: RoomBillsComponent
  },
  {
    path: 'print/electric-bills',
    canActivate: [AuthGuardService],
    component: ElectricBillsComponent,
  },
  {
    path: 'print/unpaid-balance-tenants/tenants/:date',
    canActivate: [AuthGuardService],
    component: TenantsComponent
  },
  {
    path: 'print/promisory-note/note/:name',
    canActivate: [AuthGuardService],
    component: NoteComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
