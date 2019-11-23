import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormArray, Form, FormGroup } from '@angular/forms';
import {
        MatDatepicker,
        MatSelectChange,
        PageEvent,
        MatDialog,
        MatSelect } from '@angular/material';
import * as moment from 'moment';
import { Moment} from 'moment';
import { PaymentEnumService, RoomService, PaymentService, NotificationService } from '@gmrc/services';
import { PaymentStatus, FilterType, RoomType, DeckStatus } from '@gmrc/enums';
import { PageRequest, Room, PageData, RoomTenant, RoomPayment } from '@gmrc/models';
import { RoomPaymentDialogComponent } from '@gmrc/shared';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomFormComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;
  form = this.formBuilder.group({
    roomNumber: [{value: '', disabled: true}, Validators.required],
    date: ['', Validators.required],
    previousReading: ['', Validators.required],
    previousReadingKWUsed: ['', Validators.required],
    presentReading: ['', Validators.required],
    presentReadingKWUsed: ['', Validators.required],
    total: [{value: '', disabled: true}],
    amountKWUsed: ['', Validators.required],
    totalAmountElectricBill: [{value: '', disabled: true}],
    electricBillStatus: [PaymentStatus.UNPAID, Validators.required],
    electricBillBalance: this.formBuilder.array([]),
    waterBillStatus: [PaymentStatus.UNPAID, Validators.required],
    waterBill: ['', Validators.required],
    waterBillBalance: this.formBuilder.array([]),
    riceCookerBillStatus: [PaymentStatus.UNPAID, Validators.required],
    riceCookerBill: ['', Validators.required],
    riceCookerBillBalance: this.formBuilder.array([]),
    roomTenants: ['', Validators.required],
    roomType: [''],
    _id: null,
  });
  formTitle = 'ADD ROOM PAYMENT';
  date: Moment;
  roomNumbers: number[] = [];
  pageRequest = new PageRequest(null, null);
  roomType: string = null;
  roomTenantsDataSource: Array<RoomTenant> = [];
  roomTenants: Array<RoomTenant> = [];
  pageNumber = 0;
  pageSize = 5;
  columns: string[] = [
    'tenants',
    'dueDate',
    'monthlyRent',
    'status',
    'action',
  ];
  pageSizeOptions: number[] = [5, 10, 15];
  totalCount: number;
  buttonName = 'Add';
  model: RoomPayment;
  disabledShowTenantsButton = true;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private paymentEnumService: PaymentEnumService,
    private roomService: RoomService,
    private dialog: MatDialog,
    private router: Router,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  get isRoomNumberControlEmpty(): boolean {
    return this.form.get('roomNumber').invalid;
  }
  chosenMonthHandler(date: Moment, datepicker: MatDatepicker<Moment>): void {
    this.date = date;
    this.form.get('date').setValue(this.monthYear);
    datepicker.close();
  }
  loadFormValue(): void {
    if (this.model.electricBillBalance.length) {
      this.electricBillBalanceFormArray.push(
        this.formBuilder.group({
          balance: this.model.electricBillBalance[0].balance,
        })
      );
    }
    if (this.model.waterBillBalance.length) {
      this.waterBillBalanceFormArray.push(
        this.formBuilder.group({
          balance: this.model.waterBillBalance[0].balance,
        })
      );
    }
    if (this.model.riceCookerBillBalance.length) {
      this.riceCookerBillBalanceFormArray.push(
        this.formBuilder.group({
          balance: this.model.riceCookerBillBalance[0].balance,
        })
      );
    }
    this.form.patchValue({
      amountKWUsed: this.model.amountKWUsed,
      date: this.model.date,
      electricBillStatus: this.model.electricBillStatus,
      totalAmountElectricBill: this.model.totalAmountElectricBill,
      presentReading: this.model.presentReading,
      presentReadingKWUsed: this.model.presentReadingKWUsed,
      previousReading: this.model.previousReading,
      previousReadingKWUsed: this.model.previousReadingKWUsed,
      riceCookerBillStatus: this.model.riceCookerBillStatus,
      riceCookerBill: this.model.riceCookerBill,
      roomNumber: this.model.roomNumber,
      waterBillStatus: this.model.waterBillStatus,
      waterBill: this.model.waterBill,
      roomTenants: this.model.roomTenants,
      roomType: this.model.roomType,
      _id: this.model._id,
    });
    this.calculateTotalKWused();
    this.calculateTotalAmountElectricBill();
  }
  getRoomPaymentByObjectId(roomPaymentObjectId: string): void {
    this.pageRequest.filters.type = FilterType.ROOMPAYMENTBYOBJECTID;
    this.pageRequest.filters.roomPaymentObjectId = roomPaymentObjectId;
    this.paymentService.getRoomPayments<RoomPayment>(this.pageRequest)
    .then(roomPayment => {
      this.model = roomPayment.data[0];
      this.totalCount = this.model.roomTenants.length;
      this.roomTenants = this.model.roomTenants;
      this.loadFormValue();
      this.buttonName = 'Update';
      this.tablePagination();
      this.disabledShowTenantsButton = false;
      this.isLoading = false;

    })
    .catch( err => {});
  }
  getRoomNumbers(): void {
    this.pageRequest.filters.type = FilterType.ALLROOMS;
    this.roomService.getRooms<Room>(this.pageRequest).then( rooms => {
      rooms.data.forEach(room => {
        this.roomNumbers.push(room.number);
      });
    })
    .catch( err => {});
  }
  isGoingToUpdate(): void {
    const roomPaymentObjectId = this.route.snapshot.paramMap.get('id');
    this.getRoomNumbers();
    if (roomPaymentObjectId !== null) {
      this.getRoomPaymentByObjectId(roomPaymentObjectId);
    } else {
      this.form.get('roomNumber').enable();
      this.isLoading = false;
    }
  }
  get monthYear(): string {
    if (!this.date) { return null; }
    return moment(this.date).format('MM/YYYY');
  }
   // TODO: what if there is no previous reading?
   calculateTotalKWused(): void {
    const previousReading = this.form.get('previousReadingKWUsed').value;
    const presentReading = this.form.get('presentReadingKWUsed').value;
    const absoluteNum = Math.abs(previousReading - presentReading);
    this.form.get('total').setValue(Math.round( absoluteNum * 100 + Number.EPSILON ) / 100);
  }
  calculateTotalAmountElectricBill(): void {
    const totalKWused = this.form.get('total').value;
    const amountKWUsed = this.form.get('amountKWUsed').value;
    this.form.get('totalAmountElectricBill').setValue(Math.round(totalKWused * amountKWUsed));
  }
  get electricBillBalanceFormArray(): FormArray {
    return this.form.get('electricBillBalance') as FormArray;
  }
  get waterBillBalanceFormArray(): FormArray {
    return this.form.get('waterBillBalance') as FormArray;
  }
  get riceCookerBillBalanceFormArray(): FormArray {
    return this.form.get('riceCookerBillBalance') as FormArray;
  }
  get createBalanceFormGroup(): FormGroup {
    return this.formBuilder.group({
      balance: ['', Validators.required]
    });
  }
  addElectricBillBalanceFormGroup(): void {
    this.electricBillBalanceFormArray.push(this.createBalanceFormGroup);
  }
  removeElectricBillBalanceFormGroup(): void {
    if ( this.electricBillBalanceFormArray.length > 0  ) {
      this.electricBillBalanceFormArray.removeAt(0);
    }
  }
  electricBillStatusToggle($event: MatSelectChange): void {
    if ($event.value === PaymentStatus.BALANCE) {
      this.addElectricBillBalanceFormGroup();
    } else {
      this.removeElectricBillBalanceFormGroup();
    }
  }
  addWaterBillBalanceFormGroup(): void {
    this.waterBillBalanceFormArray.push(this.createBalanceFormGroup);
  }
  removeWaterBillBalanceFormGroup(): void {
    if (this.waterBillBalanceFormArray.length > 0  ) {
      this.waterBillBalanceFormArray.removeAt(0);
    }
  }
  waterBillStatusToggle($event: MatSelectChange): void {
    if ($event.value === PaymentStatus.BALANCE) {
      this.addWaterBillBalanceFormGroup();
    } else {
      this.removeWaterBillBalanceFormGroup();
    }
  }
  addRiceCookerBillBalanceFormGroup(): void {
    this.riceCookerBillBalanceFormArray.push(this.createBalanceFormGroup);
  }
  removeaddRiceCookerBillBalanceFormGroup(): void {
    if (this.riceCookerBillBalanceFormArray.length > 0  ) {
      this.riceCookerBillBalanceFormArray.removeAt(0);
    }
  }
  riceCookerBillStatusToggle($event: MatSelectChange): void {
    if ($event.value === PaymentStatus.BALANCE) {
      this.addRiceCookerBillBalanceFormGroup();
    } else {
      this.removeaddRiceCookerBillBalanceFormGroup();
    }
  }
  async getRoomByRoomNumber(): Promise<PageData<Room>> {
    this.pageRequest.filters.type       = FilterType.ROOMNUMBER;
    this.pageRequest.filters.roomFilter = {number: this.form.get('roomNumber').value};
    try {
      this.pageRequest.filters.type = FilterType.ROOMNUMBER;
      this.pageRequest.filters.roomFilter = {number: this.form.get('roomNumber').value};
      return await this.roomService.getRooms<Room>(this.pageRequest);
    } catch (error) {
      return error;
    }
  }
  getRoomTenants(room: Room): Array<RoomTenant> {
    const roomTenants: Array<RoomTenant> = [];
    let roomTennantIndex = 0;
    if ( room.type === RoomType.BEDSPACE ) {

      room.bedspaces.forEach( bedspace => {
        bedspace.decks.forEach( deck => {
          const roomTenant: RoomTenant      = {
                                                name: null,
                                                dueRentDate: null,
                                                rent: null,
                                                rentStatus: {value: null},
                                                index: null,

                                              };
          const awayRoomTenant: RoomTenant  = {
                                                name: null,
                                                dueRentDate: null,
                                                rent: null,
                                                rentStatus: {value: null},
                                                index: null,
                                              };
          if ( deck.tenant !== null ) {
            roomTenant.name                 = `${deck.tenant.firstname} ${deck.tenant.middlename} ${deck.tenant.lastname}`;
            roomTenant.dueRentDate          = deck.dueRentDate;
            roomTenant.rent                 = deck.monthlyRent;
            roomTenant.rentStatus.value     = PaymentStatus.UNPAID;
            roomTenant.rentStatus.balance   = null;
            roomTenant.index                = roomTennantIndex;
            roomTenants.push(roomTenant);
            roomTennantIndex++;
          }
          if (deck.status === DeckStatus.AWAY && deck.away[0].tenant !== null ) {
            // tslint:disable-next-line: max-line-length
            awayRoomTenant.name             = `${deck.away[0].tenant.firstname} ${deck.away[0].tenant.middlename} ${deck.away[0].tenant.lastname}`;
            awayRoomTenant.dueRentDate      = deck.away[0].dueRentDate;
            awayRoomTenant.rent             = deck.away[0].rent;
            awayRoomTenant.rentStatus.value = PaymentStatus.UNPAID;
            roomTenant.rentStatus.balance   = null;
            awayRoomTenant.index            = roomTennantIndex;
            roomTenants.push(awayRoomTenant);
            roomTennantIndex++;
          }
        });
      });
    } else {
      room.transientPrivateRoomProperties[0].tenants.forEach( (tenant, arrIndex) => {
        const roomTenant: RoomTenant = {
                                          name: null,
                                          dueRentDate: null,
                                          rent: null,
                                          rentStatus: {value: null},
                                          index: null,
                                        };
        if ( arrIndex === 0 ) {
          roomTenant.name               = `${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`;
          roomTenant.dueRentDate        = room.transientPrivateRoomProperties[0].dueRentDate;
          roomTenant.rent               = room.transientPrivateRoomProperties[0].monthlyRent;
          roomTenant.rentStatus.value   = PaymentStatus.UNPAID;
          roomTenant.rentStatus.balance = null;
          roomTenant.index              = roomTennantIndex;
          roomTenants.push(roomTenant);
        } else {
          roomTenant.name               = `${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`;
          roomTenant.index              = roomTennantIndex;
          roomTenants.push(roomTenant);
        }
        roomTennantIndex++;
      });
    }
    return roomTenants;
  }
  addRoomTenantsToForm(roomTenant: Array<RoomTenant>): void {
    this.roomTenantsDataSource   = [];
    this.roomTenants             = [];
    if (roomTenant.length > 0 ) {
      this.form.get('roomTenants').setValue(null);
      this.form.get('roomTenants').setValue(roomTenant);
    }
  }
  addRoomTenantsToRoomTenantsArray(roomTenants: Array<RoomTenant>): void {
    roomTenants.forEach( roomTenant => {
      this.roomTenants.push(roomTenant);
    });
  }
 addRoomType(room: Room): void {
  if (room.type === RoomType.BEDSPACE) {
    this.form.get('roomType').setValue(RoomType.BEDSPACE);
  } else if (room.type === RoomType.PRIVATE) {
    this.form.get('roomType').setValue(RoomType.PRIVATE);
  } else if (room.type === RoomType.SEMIPRIVATE) {
    this.form.get('roomType').setValue(RoomType.SEMIPRIVATE);
  } else if (room.type === RoomType.TRANSIENT) {
    this.form.get('roomType').setValue(RoomType.TRANSIENT);
  }
 }
  async showTenants(): Promise<void> {
    try {
      const roomByRoomNumber                = await this.getRoomByRoomNumber();
      this.pageRequest.filters.type         = roomByRoomNumber.data[0].type === RoomType.BEDSPACE ?
                                              FilterType.BEDSPACEROOMBYOBJECTID :
                                              FilterType.TRANSIENTPRIVATEROOMBYOBJECTID;
      this.pageRequest.filters.roomObjectId = roomByRoomNumber.data[0]._id;
      const roomByRoomType                  = await this.roomService.getRooms<Room>(this.pageRequest);
      const roomTenants                     = this.getRoomTenants(roomByRoomType.data[0]);
      this.addRoomType(roomByRoomType.data[0]);
      this.addRoomTenantsToForm(roomTenants);
      this.addRoomTenantsToRoomTenantsArray(roomTenants);
      this.totalCount = this.roomTenants.length;
      this.tablePagination();
    } catch (error) {}
  }
  tablePagination(): void {
    const start     = this.pageSize * this.pageNumber;
    const end       = this.pageSize * (this.pageNumber + 1);
    this.roomTenantsDataSource   = this.roomTenants.slice(start, end);
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.pageNumber = $event.pageIndex;
    this.pageSize   = $event.pageSize;
    this.tablePagination();
  }
  updateTenantPayment(index: number): void {
    const dialogRef = this.dialog.open(
      RoomPaymentDialogComponent,
      {
        data: {
          name:    this.roomTenants[index].name,
          dueDate: this.roomTenants[index].dueRentDate,
          rent:    this.roomTenants[index].rent,
          rentStatus: {
            value: this.roomTenants[index].rentStatus.value,
            balance: this.roomTenants[index].rentStatus.balance !== null
            ? this.roomTenants[index].rentStatus.balance
            : null,
          }
        }
      }
    );
    dialogRef.afterClosed().subscribe( (result) => {
      if (result !== undefined) {
        this.roomTenants[index].rentStatus.value = result.status;
         if (result.rentBalance.length !== 0 ) {
          this.roomTenants[index].rentStatus.balance = result.rentBalance[0].balance;
         }
       this.roomTenantsDataSource = this.roomTenants;
       this.tablePagination();
      }
    });
  }
  routeToRoomPayments() {
    this.router.navigate(['payment/room']);
  }
  onSubmit() {
    this.isSubmitting = true;
    const formValue: RoomPayment = this.form.getRawValue();
    let promiseForm: Promise<RoomPayment>;
    promiseForm = this.model
     ? this.paymentService.updateRoomPayment(formValue)
     : this.paymentService.addRoomPayment(formValue);
    promiseForm.then( roomPayment => {
      const message = this.model ? 'Updated room payment' : 'Added room payment';
      this.model = roomPayment;
      this.form.get('_id').setValue(this.model._id);
      this.notificationService.notifySuccess(message);
      this.buttonName = 'Update';
      this.isSubmitting = false;
    })
    .catch( err => {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    });
  }
  roomNumbersToggle($event: MatSelect): void {
    if ($event.value) {
      this.disabledShowTenantsButton = false;
    }
  }
}
