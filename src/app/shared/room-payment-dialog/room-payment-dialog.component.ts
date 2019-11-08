import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { PaymentEnumService } from '@gmrc/services';
import { PaymentStatus } from '@gmrc/enums';
import { TenantPayment } from '@gmrc/models';

@Component({
  selector: 'app-room-payment-dialog',
  templateUrl: './room-payment-dialog.component.html',
  styleUrls: ['./room-payment-dialog.component.scss']
})
export class RoomPaymentDialogComponent implements OnInit {
  form = this.formBuilder.group({
    name: {value: this.data.name, disabled: true},
    dueDate: {value: this.data.dueDate, disabled: true},
    rent: {value: this.data.rent, disabled: true},
    rentBalance: this.formBuilder.array([]),
    status: this.data.status
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TenantPayment,
    private formBuilder: FormBuilder,
    private paymentEnumService: PaymentEnumService,
  ) { }

  ngOnInit() {
    if (this.data.rentBalance[0] !== null) {
      this.rentBalanceFormArray.push(this.formBuilder.group({
        balance: this.data.rentBalance[0].balance,
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
