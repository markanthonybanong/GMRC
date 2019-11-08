import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RoomStatus, RoomType } from '@gmrc/enums';
import { RoomEnumService, RoomService, NotificationService } from '@gmrc/services';
import { MatSelectChange } from '@angular/material';
import { Room } from '@gmrc/models';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  form = this.formBuilder.group({
    number: ['', Validators.required],
    floor: ['', Validators.required],
    type: ['', Validators.required],
    aircon: ['', Validators.required],
    transientPrivateRoomProperties: this.formBuilder.array([]),
    _id: ['']
  });
  buttonName = 'Add';
  isSubmitting = false;
  model: Room;
  constructor(
    private formBuilder: FormBuilder,
    private roomEnumService: RoomEnumService,
    private roomService: RoomService,
    private notificationService: NotificationService,
    private location: Location,
  ) { }

  ngOnInit() {
  }
  createTransientPrivateRoomProperties(): FormGroup {
    return this.formBuilder.group({
    status: [RoomStatus.VACANT, Validators.required],
    dueRentDate: [''],
    monthlyRent: [''],
    });
  }
  getTransientPrivateRoomProperties(): FormArray {
    return this.form.get('transientPrivateRoomProperties') as FormArray;
  }
  addTransientPrivateRoomProperties(): void {
    const transientPrivateRoomProperties = this.getTransientPrivateRoomProperties();
    if (transientPrivateRoomProperties.length === 0) {
      this.getTransientPrivateRoomProperties().push(this.createTransientPrivateRoomProperties());
    }
  }
  removeTransientPrivateProperties(): void {
    const transientPrivateRoomProperties = this.getTransientPrivateRoomProperties();
    if (transientPrivateRoomProperties.length > 0 ) {
      transientPrivateRoomProperties.removeAt(0);
    }
  }
  roomTypeToggle($event: MatSelectChange): void {
    if ($event.value !== RoomType.BEDSPACE) {
      this.addTransientPrivateRoomProperties();
    } else {
      this.removeTransientPrivateProperties();
    }
  }
  onSubmit(): void {
    this.isSubmitting = false;
    let promiseForm: Promise<Room>;
    promiseForm = this.model
    ? this.roomService.updateRoom(this.form.value)
    : this.roomService.addRoom(this.form.value);
    promiseForm.then ( (room) => {
      const notificationMessage = this.model ?
      `Updated room number ${room.number}` :
      `Added room number ${room.number}`;
      this.notificationService.notifySuccess(notificationMessage);
      this.form.get('_id').patchValue(room._id);
      this.model = room;
      this.isSubmitting = false;
      this.buttonName = 'Update';
    })
    .catch ( (err) => {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    });
  }
  backToPreviousWindow(): void {
    this.location.back();
  }
}
