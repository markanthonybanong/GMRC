import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponent } from './photo/photo.component';
import { AngularMaterialModule } from '@gmrc/shared';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    WebcamModule,
  ],
  declarations: [PhotoComponent]
})
export class PhotoModule { }
