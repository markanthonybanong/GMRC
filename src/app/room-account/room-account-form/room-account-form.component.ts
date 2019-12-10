import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomAccount, PageRequest, PageData } from '@gmrc/models';
import { RoomAccountService, NotificationService } from '@gmrc/services';
import { FilterType } from '@gmrc/enums';

@Component({
  selector: 'app-room-account-form',
  templateUrl: './room-account-form.component.html',
  styleUrls: ['./room-account-form.component.scss']
})
export class RoomAccountFormComponent implements OnInit {
  form = this.formBuilder.group({
    roomNumber: [null, Validators.required],
    password: [null, Validators.required],
    _id: null,
  });
  formTitle = 'ADD ROOM ACCOUNT';
  buttonName = 'Add';
  isSubmitting = false;
  model: RoomAccount;
  isLoading = true;
  pageRequest = new PageRequest(null, null);
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private roomAccountService: RoomAccountService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  isGoingToUpdate(): void {
    const objectId = this.route.snapshot.paramMap.get('id');
    console.log('object id ', objectId);

    if (objectId !== null) {
      this.getRoomAccountByObjectId(objectId);
    } else {
      this.isLoading = false;
    }
  }
  loadFormValue(): void {
    this.form.patchValue({
      _id: this.model._id,
      roomNumber: this.model.roomNumber,
      password: this.model.password,
    });
  }
  async getRoomAccountByObjectId(objectId: string): Promise<void> {
    try {
      this.pageRequest.filters.type                = FilterType.ROOMACCOUNTBYOBJECTID;
      this.pageRequest.filters.roomAccountObjectId = objectId;
      const roomAccount                            = await this.roomAccountService.getRoomAccounts<RoomAccount>(this.pageRequest);
      this.model                                   = roomAccount.data[0];
      this.loadFormValue();
      this.formTitle                               = 'UPDATE ROOM ACCOUNT';
      this.buttonName                              = 'Update';
      this.isLoading                               = false;
    } catch (error) {
    }
  }
  backToRoomAccountList(): void {
    this.router.navigate(['room-account']);
  }
  generateRoomAccountPassword(): void {
    const min = 100000;
    const max = 999999;
    this.form.get('password').setValue(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      const roomAccount = this.model
                          ? await this.roomAccountService.updateRoomAccount(this.form.value)
                          : await this.roomAccountService.addRoomAccount(this.form.value);
      const message     = this.model
                          ? `Room account updated for room number ${roomAccount.roomNumber}`
                          : `Room account created for room number ${roomAccount.roomNumber}`;
      this.form.get('_id').setValue(roomAccount._id);
      this.model        = roomAccount;
      this.buttonName   = 'Update';
      this.notificationService.notifySuccess(message);
      this.isSubmitting = false;
    } catch (error) {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    }
  }
}
