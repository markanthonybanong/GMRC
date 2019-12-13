import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { PrintModule } from '../print/print.module';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    LayoutModule,
    PrintModule
  ],
  declarations: []
})
export class HomeModule { }
