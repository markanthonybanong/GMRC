import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-tenant-photo',
  templateUrl: './upload-tenant-photo.component.html',
  styleUrls: ['./upload-tenant-photo.component.scss']
})
export class UploadTenantPhotoComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  form = this.formBuilder.group({
    tenantImage : [null, Validators.required]
  });
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }
  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.form.get('tenantImage').setValue(event.base64);
    this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
}
