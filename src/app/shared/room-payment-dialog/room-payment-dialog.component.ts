import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { PaymentEnumService } from '@gmrc/services';
import { PaymentStatus } from '@gmrc/enums';
import { RoomTenant } from '@gmrc/models';

@Component({
  selector: 'app-room-payment-dialog',
  templateUrl: './room-payment-dialog.component.html',
  styleUrls: ['./room-payment-dialog.component.scss']
})
export class RoomPaymentDialogComponent implements OnInit {
  form = this.formBuilder.group({
    name: {value: this.data.name, disabled: true},
    dueDate: {value: this.data.dueRentDate, disabled: true},
    rent: {value: this.data.rent, disabled: true},
    status: this.data.rentStatus.value,
    rentBalance: this.formBuilder.array([]),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private paymentEnumService: PaymentEnumService,
  ) { }

  ngOnInit() {
    if (this.data.rentStatus.balance !== null) {
      this.rentBalanceFormArray.push(this.formBuilder.group({
        balance: this.data.rentStatus.balance,
      }));
    }
  }
  get createBalanceFormGroup(): FormGroup {
    return this.formBuilder.group({
      balance: [null, Validators.required]
    });
  }
  get rentBalanceFormArray(): FormArray {
    return this.form.get('rentBalance') as FormArray;
  }
  addRentBalanceFormGroup(): void {
    this.rentBalanceFormArray.push(this.createBalanceFormGroup);
  }
  removeRentBalanceFormGroup(): void {
    this.rentBalanceFormArray.removeAt(0);
  }
  statusToggle($event: MatSelectChange): void {
    if ($event.value === PaymentStatus.BALANCE) {
      this.addRentBalanceFormGroup();
    } else {
      this.removeRentBalanceFormGroup();
    }
  }
}
