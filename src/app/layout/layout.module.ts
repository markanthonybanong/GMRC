import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent, SharedModule } from '@gmrc/shared';
import { LayoutComponent } from './layout/layout.component';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';

import { HomeRoutingModule } from '../home/home-routing.module';



@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    HomeRoutingModule,
    SharedModule
  ],
  exports: [

  ],
  declarations: [LayoutComponent, SideBarComponent, HeaderComponent],
  entryComponents: [ConfirmationDialogComponent],
})
export class LayoutModule { }
