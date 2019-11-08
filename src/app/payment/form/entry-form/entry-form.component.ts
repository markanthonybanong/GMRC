import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Tenant, PageRequest, Entry, Room } from '@gmrc/models';
import { FilterType, PaymentStatus } from '@gmrc/enums';
import { TenantService, PaymentService, PaymentEnumService, NotificationService, RoomService } from '@gmrc/services';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit {
  isLoading = true;
  form = this.formBuilder.group({
    roomNumber: ['', Validators.required],
    tenant: ['', Validators.required],
    monthlyRent: ['', Validators.required],
    key: ['', Validators.required],
    dateEntry: ['', Validators.required],
    dateExit: [''],
    oneMonthDeposit: ['', Validators.required],
    oneMonthDepositBalance: this.formBuilder.array([]),
    oneMonthAdvance: ['', Validators.required],
    oneMonthAdvanceBalance: this.formBuilder.array([]),
    tenantObjectId: ['',  Validators.required],
    _id: '',
  });
  roomNumbers: number[] = [];
  pageRequest = new PageRequest(null, null);
  tenants: Tenant[] = [];
  buttonName = 'Add';
  formTitle = 'ADD ENTRY';
  isSubmitting = false;
  model: Entry;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private tenantService: TenantService,
    private router: Router,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private roomService: RoomService,
    private paymentEnumService: PaymentEnumService
  ) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  getOneMonthDepositBalance(): FormArray{
    return this.form.get('oneMonthDepositBalance') as FormArray;
  }
  createBalanceFormGroup(): FormGroup {
    return this.formBuilder.group({
      balance: ['', Validators.required]
    });
  }
  getOneMonthAdvanceBalance(): FormArray{
    return this.form.get('oneMonthAdvanceBalance') as FormArray;
  }
  getRoomNumbers() {
    this.pageRequest.filters.type = FilterType.ALLROOMS;
    this.roomService.getRooms<Room>(this.pageRequest).then( rooms => {
      rooms.data.forEach(room => {
        this.roomNumbers.push(room.number);
      });
    })
    .catch( err => {});
  }
  isGoingToUpdate(): void {
    const entryObjectId = this.route.snapshot.paramMap.get('id');
    this.getRoomNumbers();
    if (entryObjectId !== null) {
      this.formTitle = 'UPDATE ENTRY';
      this.getEntryByObjectId(entryObjectId);
    } else {
      this.isLoading = false;
    }
  }
  loadFormValue(): void {
    if (this.model.oneMonthDepositBalance.length) {
      this.getOneMonthDepositBalance().push(
        this.formBuilder.group({
          balance: this.model.oneMonthDepositBalance[0].balance,
        })
      );
    }
    if (this.model.oneMonthAdvanceBalance.length) {
      this.getOneMonthAdvanceBalance().push(
        this.formBuilder.group({
          balance: this.model.oneMonthAdvanceBalance[0].balance,
        })
      );
    }
    this.form.patchValue({
      _id: this.model._id,
      roomNumber: this.model.roomNumber,
      tenant: `${this.model.tenant[0].firstname} ${this.model.tenant[0].middlename} ${this.model.tenant[0].lastname}`,
      monthlyRent: this.model.monthlyRent,
      key: this.model.key,
      dateEntry: this.model.dateEntry,
      dateExit: this.model.dateExit,
      oneMonthDeposit: this.model.oneMonthDeposit,
      oneMonthAdvance: this.model.oneMonthAdvance,
      tenantObjectId: this.model.tenant[0]._id,
    });
  }
  getEntryByObjectId(objectId: string): void {
    this.pageRequest.filters.type = FilterType.ENTRYBYOBJECTID;
    this.pageRequest.filters.entryObjectId = objectId;
    this.paymentService.getEntries<Entry>(this.pageRequest)
    .then( entry => {
      this.model = entry.data[0];
      this.loadFormValue();
      this.buttonName = 'Update';
      this.isLoading = false;
    });
  }
  searchTenant(inputTenantName: string): void {
    if (inputTenantName.length !== 0 ) {
      this.pageRequest.filters.tenantName = inputTenantName;
      this.pageRequest.filters.type = FilterType.TENANTBYKEYSTROKE;
      this.tenantService.getTenants<Tenant>(this.pageRequest)
      .then( tenant => {
        this.tenants = tenant.data;
      }).catch( error => {
     });
    }
  }
  addOneMonthDepositBalanceFormGroup(): void {
    const formArray = this.getOneMonthDepositBalance();
    if ( formArray.length === 0 ) {
      formArray.push(this.createBalanceFormGroup());
    }
  }
  removeOneMonthDepositBalanceFormGroup(): void {
    const formArray = this.getOneMonthDepositBalance();
    if ( formArray.length > 0 ) {
      formArray.removeAt(0);
    }
  }
  oneMonthDepositToggle($event: MatSelectChange): void {
    if ($event.value === PaymentStatus.BALANCE) {
      this.addOneMonthDepositBalanceFormGroup();
    } else {
      this.removeOneMonthDepositBalanceFormGroup();
    }
  }
  addOneMonthAdvanceBalanceFormGroup(): void {
    const formArray = this.getOneMonthAdvanceBalance();
    if ( formArray.length === 0 ) {
      formArray.push(this.createBalanceFormGroup());
    }
  }
  removeOneMonthAdvanceBalanceFormGroup(): void {
    const formArray = this.getOneMonthAdvanceBalance();
    if ( formArray.length > 0 ) {
      formArray.removeAt(0);
    }
  }
  oneMonthAdvanceToggle($event: MatSelectChange): void {
    if ($event.value === PaymentStatus.BALANCE) {
      this.addOneMonthAdvanceBalanceFormGroup();
    } else {
      this.removeOneMonthAdvanceBalanceFormGroup();
    }
  }
  routeToEntries(): void {
    this.router.navigate([`payment/entry`]);
  }
  patchTenantObjectId(tenantObjectId: string): void {
    this.form.get('tenantObjectId').patchValue(tenantObjectId);
  }
  onSubmit() {
    this.isSubmitting = true;
    let promiseForm: Promise<Entry>;
    promiseForm = this.model
     ? this.paymentService.updateEntry(this.form.value)
     : this.paymentService.addEntry(this.form.value);
    promiseForm.then( (entry) => {
       this.model = entry;
       const message = this.model ? 'Updated entry' : 'Added entry';
       this.notificationService.notifySuccess(message);
       this.buttonName = 'Update';
       this.isSubmitting = false;
    })
    .catch( (err) => {
       this.notificationService.notifyFailed('Something went wrong');
       this.isSubmitting = false;
    });
  }
}
