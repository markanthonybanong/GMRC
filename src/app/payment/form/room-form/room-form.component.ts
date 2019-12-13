import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { PaymentStatus, FilterType, RoomType, DeckStatus, Interest } from '@gmrc/enums';
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
    electricBillInterest: null,
    electricBillStatus: [PaymentStatus.UNPAID, Validators.required],
    electricBillBalance: this.formBuilder.array([]),
    enterWaterBill: [''],
    waterBillStatus: PaymentStatus.NONE,
    waterBill: [{value: null, disabled: true}],
    waterBillInterest: null,
    waterBillBalance: this.formBuilder.array([]),
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
    'riceCookerBill',
    'rentStatus',
    'riceCookerBillStatus',
    'action',
  ];
  pageSizeOptions: number[] = [5, 10, 15];
  totalCount: number;
  buttonName = 'Add';
  model: RoomPayment;
  disabledShowTenantsButton = true;
  currentDate = moment().date();
  electricBillPlaceHolder = 'Electric bill';
  waterBillPlaceHolder = 'Water bill';

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
  setPlaceHolders(): void {
    if (this.model.electricBillInterest !== null ) {
      this.electricBillPlaceHolder = `Electric bill ${this.model.electricBillInterest}`;
    }
    if (this.model.waterBillInterest !== null) {
      this.waterBillPlaceHolder = `Water bill ${this.model.waterBillInterest}`;
    }
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

    this.form.patchValue({
      amountKWUsed: this.model.amountKWUsed,
      date: this.model.date,
      total: this.model.total,
      electricBillStatus: this.model.electricBillStatus,
      totalAmountElectricBill: this.model.totalAmountElectricBill,
      electricBillInterest: this.model.electricBillInterest,
      presentReading: this.model.presentReading,
      presentReadingKWUsed: this.model.presentReadingKWUsed,
      previousReading: this.model.previousReading,
      previousReadingKWUsed: this.model.previousReadingKWUsed,
      roomNumber: this.model.roomNumber,
      waterBillStatus: this.model.waterBillStatus,
      waterBill: this.model.waterBill,
      waterBillInterest: this.model.waterBillInterest,
      roomTenants: this.model.roomTenants,
      roomType: this.model.roomType,
      _id: this.model._id,
    });
    this.addElectricBillInterest();
    this.addWaterBillInterest();
    this.setPlaceHolders();
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
    this.form.get('electricBillInterest').setValue(null);
    this.addElectricBillInterest();
  }
  get electricBillBalanceFormArray(): FormArray {
    return this.form.get('electricBillBalance') as FormArray;
  }
  get waterBillBalanceFormArray(): FormArray {
    return this.form.get('waterBillBalance') as FormArray;
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
                                                rentToPay: null,
                                                rentInterestAdded: null,
                                                rentStatus: {value: null},
                                                riceCookerBill: null,
                                                riceCookerBillToPay: null,
                                                riceCookerBillInterestAdded: null,
                                                riceCookerBillStatus: {value: null},
                                                index: null,
                                              };
          const awayRoomTenant: RoomTenant  = {
                                                name: null,
                                                dueRentDate: null,
                                                rent: null,
                                                rentToPay: null,
                                                rentInterestAdded: null,
                                                rentStatus: {value: null},
                                                index: null,
                                              };
          if ( deck.tenant !== null ) {
            roomTenant.name                         = `${deck.tenant.firstname} ${deck.tenant.middlename} ${deck.tenant.lastname}`;
            roomTenant.dueRentDate                  = deck.dueRentDate;
            roomTenant.rent                         = deck.monthlyRent;
            roomTenant.rentToPay                    = deck.monthlyRent;
            roomTenant.rentStatus.value             = PaymentStatus.UNPAID;
            roomTenant.rentStatus.balance           = null;
            roomTenant.riceCookerBill               = deck.riceCookerBill;
            roomTenant.riceCookerBillToPay          = deck.riceCookerBill;
            roomTenant.riceCookerBillStatus.value   = PaymentStatus.UNPAID;
            roomTenant.riceCookerBillStatus.balance = null;
            roomTenant.index                        = roomTennantIndex;
            roomTenants.push(roomTenant);
            roomTennantIndex++;
          }
          if (deck.status === DeckStatus.AWAY && deck.away[0].tenant !== null ) {
            // tslint:disable-next-line: max-line-length
            awayRoomTenant.name                     = `${deck.away[0].tenant.firstname} ${deck.away[0].tenant.middlename} ${deck.away[0].tenant.lastname}`;
            awayRoomTenant.dueRentDate              = deck.away[0].dueRentDate;
            awayRoomTenant.rent                     = deck.away[0].rent;
            awayRoomTenant.rentToPay                = deck.away[0].rent;
            awayRoomTenant.rentStatus.value         = PaymentStatus.UNPAID;
            roomTenant.rentStatus.balance           = null;
            awayRoomTenant.index                    = roomTennantIndex;
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
                                          rentToPay: null,
                                          rentInterestAdded: null,
                                          rentStatus: {value: null},
                                          riceCookerBill: null,
                                          riceCookerBillToPay: null,
                                          riceCookerBillInterestAdded: null,
                                          riceCookerBillStatus: {value: null},
                                          index: null,
                                        };
        if ( arrIndex === 0 ) {
          roomTenant.name                         = `${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`;
          roomTenant.dueRentDate                  = room.transientPrivateRoomProperties[0].dueRentDate;
          roomTenant.rent                         = room.transientPrivateRoomProperties[0].monthlyRent;
          roomTenant.rentToPay                    = room.transientPrivateRoomProperties[0].monthlyRent;
          roomTenant.rentStatus.value             = PaymentStatus.UNPAID;
          roomTenant.rentStatus.balance           = null;
          roomTenant.riceCookerBill               = room.transientPrivateRoomProperties[0].riceCookerBill;
          roomTenant.riceCookerBillToPay          = room.transientPrivateRoomProperties[0].riceCookerBill;
          roomTenant.riceCookerBillStatus.value   = PaymentStatus.UNPAID;
          roomTenant.riceCookerBillStatus.balance = null;
          roomTenant.index                        = roomTennantIndex;
          roomTenants.push(roomTenant);
        } else {
          roomTenant.name               = `${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`;
          roomTenant.dueRentDate        = null;
          roomTenant.rent               = null;
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
  addPercent(rentAmount: number, percent: number): number {
    const decimal              = percent / 100;
    const addOneToDecimalValue = decimal + 1;
    const rentWithAddedPercent = rentAmount * addOneToDecimalValue;
    return Math.round(rentWithAddedPercent);
  }
  addRoomRentInterest(): void {
    this.roomTenants.forEach(tenant => {
      if ( tenant.rentStatus.value === PaymentStatus.UNPAID) {
        const dateDifference = this.currentDate - tenant.dueRentDate;
        if ( dateDifference >= 8 && dateDifference <= 10 && tenant.rentInterestAdded !== Interest.PLUSFIVEPERCENT) {
          tenant.rentToPay = this.addPercent(tenant.rent, 5);
          tenant.rentInterestAdded = Interest.PLUSFIVEPERCENT;
        } else if ( dateDifference >= 11 && dateDifference <= 15 && tenant.rentInterestAdded !== Interest.PLUSTENPERCENT) {
          tenant.rentToPay = this.addPercent(tenant.rent, 10);
          tenant.rentInterestAdded = Interest.PLUSTENPERCENT;
        } else if (dateDifference >= 16 && tenant.rentInterestAdded !== Interest.PLUSFIFTEENPERCENT) {
          tenant.rentToPay = this.addPercent(tenant.rent, 15);
          tenant.rentInterestAdded = Interest.PLUSFIFTEENPERCENT;
        }
      }
    });
  }
  addElectricBillInterest(): void {
    const electricBillStatus = this.form.get('electricBillStatus').value;
    if (electricBillStatus === PaymentStatus.UNPAID) {
      const electricBill = this.form.get('totalAmountElectricBill').value;
      const electricBillInterest = this.form.get('electricBillInterest').value;
      if (this.currentDate >= 6 && this.currentDate <= 10 && electricBillInterest !== Interest.PLUSFIVEPERCENT) {
        this.form.get('totalAmountElectricBill').setValue(this.addPercent(electricBill, 5));
        this.form.get('electricBillInterest').setValue(Interest.PLUSFIVEPERCENT);
        this.electricBillPlaceHolder = 'Electric bill +5% interest';
      } else if (this.currentDate >= 11 && this.currentDate <= 15 && electricBillInterest !== Interest.PLUSTENPERCENT) {
        this.form.get('totalAmountElectricBill').setValue(this.addPercent(electricBill, 10));
        this.form.get('electricBillInterest').setValue(Interest.PLUSTENPERCENT);
        this.electricBillPlaceHolder = 'Electric bill +10% interest';
      } else if (this.currentDate >= 16 && electricBillInterest !== Interest.PLUSFIFTEENPERCENT) {
        this.form.get('totalAmountElectricBill').setValue(this.addPercent(electricBill, 15));
        this.form.get('electricBillInterest').setValue(Interest.PLUSFIFTEENPERCENT);
        this.electricBillPlaceHolder = 'Electric bill +15% interest';
      }
    }
  }
  enterWaterBillKeyInput(): void {
    this.form.get('waterBill').setValue(this.form.get('enterWaterBill').value);
    this.form.get('waterBillInterest').setValue(null);
    this.addWaterBillInterest();
  }
  addWaterBillInterest(): void {
    const waterBillStatus = this.form.get('waterBillStatus').value;
    const roomType        = this.form.get('roomType').value;
    if (waterBillStatus === PaymentStatus.UNPAID && roomType !== RoomType.BEDSPACE ) {
      const roomTenantsArray: Array<RoomTenant> = this.form.get('roomTenants').value;
      const waterBill = this.form.get('waterBill').value;
      const dateDifference = this.currentDate - roomTenantsArray[0].dueRentDate;
      const waterBillInterest = this.form.get('waterBillInterest').value;
      if (dateDifference >= 8 && dateDifference >= 10 && waterBillInterest !== Interest.PLUSTENPERCENT) {
        this.form.get('waterBill').setValue(this.addPercent(waterBill, 10));
        this.form.get('waterBillInterest').setValue(Interest.PLUSTENPERCENT);
        this.waterBillPlaceHolder = 'Water bill +10% interest';
      } else if (this.currentDate >= 11 && this.currentDate <= 15 && waterBillInterest !== Interest.PLUSFIFTEENPERCENT ) {
        this.form.get('waterBill').setValue(this.addPercent(waterBill, 15));
        this.form.get('waterBillInterest').setValue(Interest.PLUSFIFTEENPERCENT);
        this.waterBillPlaceHolder = 'Water bill +15% interest';
      } else if (this.currentDate >= 16 && waterBillInterest !== Interest.PLUSTWENTYPERCENT) {
        this.form.get('waterBill').setValue(this.addPercent(waterBill, 20));
        this.form.get('waterBillInterest').setValue(Interest.PLUSTWENTYPERCENT);
        this.waterBillPlaceHolder = 'Water bill +20% interest';
      }
    }
  }
  addRiceCookerBillInterest(): void {
    const roomType = this.form.get('roomType').value;
    this.roomTenants.forEach((tenant, index) => {
      if (tenant.rentStatus.value === PaymentStatus.UNPAID) {
        const dateDifference = this.currentDate - tenant.dueRentDate;
        if (roomType === RoomType.BEDSPACE || index === 0) {
          if ( dateDifference >= 8 && dateDifference <= 10 && tenant.riceCookerBillInterestAdded !== Interest.PLUSTENPERCENT) {
            tenant.riceCookerBillToPay         = this.addPercent(tenant.riceCookerBill, 10);
            tenant.riceCookerBillInterestAdded = Interest.PLUSTENPERCENT;
          } else if ( dateDifference >= 11 && dateDifference <= 15 && tenant.riceCookerBillInterestAdded !== Interest.PLUSFIFTEENPERCENT) {
            tenant.riceCookerBillToPay         = this.addPercent(tenant.riceCookerBill, 15);
            tenant.riceCookerBillInterestAdded = Interest.PLUSFIFTEENPERCENT;
          } else if ( dateDifference >= 16 && tenant.riceCookerBillInterestAdded !== Interest.PLUSTWENTYPERCENT) {
            tenant.riceCookerBillToPay         = this.addPercent(tenant.riceCookerBill, 20);
            tenant.riceCookerBillInterestAdded = Interest.PLUSTENPERCENT;
          }
        }
      }
    });
  }
  tablePagination(): void {
    const start     = this.pageSize * this.pageNumber;
    const end       = this.pageSize * (this.pageNumber + 1);
    this.addRoomRentInterest();
    this.addRiceCookerBillInterest();
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
          dueRentDate: this.roomTenants[index].dueRentDate,
          rent:    this.roomTenants[index].rent,
          rentStatus: {
            value: this.roomTenants[index].rentStatus.value,
            balance: this.roomTenants[index].rentStatus.balance !== null
            ? this.roomTenants[index].rentStatus.balance
            : null,
          },
          riceCookerBill: this.roomTenants[index].riceCookerBill,
          riceCookerBillStatus: {
            value: this.roomTenants[index].riceCookerBillStatus.value,
            balance: this.roomTenants[index].riceCookerBillStatus.balance !== null
            ? this.roomTenants[index].riceCookerBillStatus.balance
            : null,
          }
        }
      }
    );
    dialogRef.afterClosed().subscribe( (result) => {
      if (result !== undefined) {
        this.roomTenants[index].rentStatus.value             = result.rentStatus;
        this.roomTenants[index].rentStatus.balance           = result.rentBalance.length > 0
                                                               ? result.rentBalance[0].balance
                                                               : null;
        this.roomTenants[index].riceCookerBillStatus.value   = result.riceCookerBillStatus;
        this.roomTenants[index].riceCookerBillStatus.balance = result.riceCookerBillBalance.length > 0
                                                               ? result.riceCookerBillBalance[0].balance
                                                               : null;

       this.roomTenantsDataSource = this.roomTenants;
       this.tablePagination();
      }
    });
  }
  routeToRoomPayments() {
    this.router.navigate(['payment/room']);
  }
  async onSubmit() {
    try {
      this.isSubmitting            = true;
      const formValue: RoomPayment = this.form.getRawValue();
      const roomPayment            = this.model
                                     ? await this.paymentService.updateRoomPayment(formValue)
                                     : await this.paymentService.addRoomPayment(formValue);
      const message                = this.model ? 'Updated room payment' : 'Added room payment';
      this.model                   = roomPayment;
      this.buttonName              = 'Update';
      this.isSubmitting            = false;
      this.form.get('_id').setValue(this.model._id);
      this.notificationService.notifySuccess(message);
    } catch (error) {
      this.notificationService.notifyFailed('Something went wrong');
      this.isSubmitting = false;
    }
  }
  roomNumbersToggle($event: MatSelect): void {
    if ($event.value) {
      this.disabledShowTenantsButton = false;
    }
  }
}
