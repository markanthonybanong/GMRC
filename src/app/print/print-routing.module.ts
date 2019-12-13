import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintComponent } from './print/print.component';
import { UnpaidBalanceTenantsComponent } from './print/unpaid-balance-tenants/unpaid-balance-tenants.component';
import { PromisoryNoteComponent } from './print/promisory-note/promisory-note.component';

const routes: Routes = [
  {
    path: '',
    component: PrintComponent,
    children: [
      {path: 'unpaid-balance-tenants', component: UnpaidBalanceTenantsComponent},
      {path: 'promisory-note', component: PromisoryNoteComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }
