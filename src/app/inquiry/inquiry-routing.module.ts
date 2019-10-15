import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InquiryComponent } from './inquiry/inquiry.component';
import { InquiryFormComponent } from './inquiry-form/inquiry-form.component';

const routes: Routes = [
  { path: '', component: InquiryComponent },
  { path: 'add', component: InquiryFormComponent },
  { path: 'update/:id', component: InquiryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquiryRoutingModule { }
