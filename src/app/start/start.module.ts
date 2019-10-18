import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartRoutingModule } from './start-routing.module';
import { StartComponent } from './start/start.component';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from '../login/login.module';




@NgModule({
  imports: [
    CommonModule,
    StartRoutingModule,
    SharedModule,
    LoginModule,
  ],
  declarations: [StartComponent]
})
export class StartModule { }
