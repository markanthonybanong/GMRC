import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { HomeModule } from '../home/home.module';
import { LoginFormComponent } from '../login/login-form/login-form.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: '', loadChildren: () => HomeModule },
  { path: 'login', component: LoginFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
