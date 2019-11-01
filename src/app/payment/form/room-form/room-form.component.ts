import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormArray, Form, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker, MatSelectChange, PageEvent } from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment} from 'moment';
import { PaymentEnumService, RoomService } from '@gmrc/services';
import { PaymentStatus, FilterType, RoomType, DeckStatus } from '@gmrc/enums';
import { PageRequest, Room, PageData, Tenant, Bedspace, RoomTenant } from '@gmrc/models';
@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomFormComponent implements OnInit {
  isLoading = true;
  form = this.formBuilder.group({
    roomNumber: ['', Validators.required],
    date: ['', Validators.required],
    previousReading: ['', Validators.required],
    previousReadingKWUsed: ['', Validators.required],
    presentReading: ['', Validators.required],
    presentReadingKWUsed: ['', Validators.required],
    total: [{value: '', disabled: true}, Validators.required],
    amountKWUsed: ['', Validators.required],
    totalAmountElectricBill: [{value: '', disabled: true}, Validators.required],
    electricBillStatus: [PaymentStatus.UNPAID, Validators.required],
    electricBillBalance: this.formBuilder.array([]),
    waterBillStatus: [PaymentStatus.UNPAID, Validators.required],
    waterBillBalance: this.formBuilder.array([]),
    riceCookerBillStatus: [PaymentStatus.UNPAID, Validators.required],
    riceCookerBillBalance: this.formBuilder.array([]),
    _id: '',
  });
  formTitle = 'ADD ROOM PAYMENT';
  date: Moment;
  roomNumbers: number[] = [];
  pageRequest = new PageRequest(null, null);
  roomType: string = null;
  roomTenants: Array<RoomTenant> = [];
  columns: string[] = [
    'tenants',
    'dueDate',
    'monthlyRent',
    'status',
    'action',
  ];
  pageSizeOptions: number[] = [6, 12];
  totalCount: number;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private paymentEnumService: PaymentEnumService,
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    this.isGoingToUpdate();
  }
  get isRoomNumberControlEmpty(): boolean {
    return this.form.get('roomNumber').invalid;
  }
  chosenMonthHandler(date: Moment, datepicker: MatDatepicker<Moment>): void {
    this.date = date;
    datepicker.close();
  }
  getRoomPayment(roomPaymentObjectId: string): void {
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
    const roomPaymentObjectId = this.route.snapshot.paramMap.get('id');
    if (roomPaymentObjectId !== null) {
      this.getRoomPayment(roomPaymentObjectId);
    } else {
      this.getRoomNumbers();
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
  setRoomTenants(room: Room): void {
    this.roomTenants = [];
    const roomTenant: RoomTenant = {names: null, dueRentDates: null, rents: null, statuses: null};
    const tenants: string []     = [];
    const dueDates: number []    = [];
    const rents: number[]        = [];
    const status: string []      = [];
    if (room.type === RoomType.BEDSPACE) {
      room.bedspaces.forEach( bedspace => {
        bedspace.decks.forEach( deck => {
          if (deck.tenant !== null) {
            tenants.push(`${deck.tenant.firstname} ${deck.tenant.middlename} ${deck.tenant.lastname}`);
            dueDates.push(deck.dueRentDate);
            rents.push(deck.monthlyRent);
            status.push(PaymentStatus.UNPAID);
          }
          if (deck.status === DeckStatus.AWAY && deck.away[0].tenant !== null ) {
            tenants.push(`${deck.away[0].tenant.firstname} ${deck.away[0].tenant.middlename} ${deck.away[0].tenant.lastname}`);
            dueDates.push(deck.away[0].dueRentDate);
            rents.push(deck.away[0].rent);
            status.push(PaymentStatus.UNPAID);
          }
        });
      });
    } else {
      room.tenantsArr.forEach( tenant => {
        tenants.push(`${tenant.firstname} ${tenant.middlename} ${tenant.lastname}`);
      });
      dueDates.push(room.transientPrivateRoomProperties[0].dueRentDate);
      rents.push(room.transientPrivateRoomProperties[0].monthlyRent);
      status.push(PaymentStatus.UNPAID);
    }
    roomTenant.names        = tenants;
    roomTenant.dueRentDates = dueDates;
    roomTenant.rents        = rents;
    roomTenant.statuses      = status;
    this.totalCount = tenants.length;
    this.roomTenants.push(roomTenant);

  }
  // setRoomTenant(roomTenants: RoomTenant) {
  //   const electricityBalanceFormGroup      = this.electricBillBalanceFormArray.at(0);
  //   const electricityBalance               = electricityBalanceFormGroup.get('balance').value;
  //   const waterBalanceFormGroup            = this.waterBillBalanceFormArray.at(0);
  //   const waterBalnce                      = waterBalanceFormGroup.get('balance').value;
  //   const riceCookerBalanceFormGroup       = this.riceCookerBillBalanceFormArray.at(0);
  //   const riceCookerBalnce                 = riceCookerBalanceFormGroup.get('balance').value;

  //   roomTenants.electricBillStatus   = this.form.get('electricBillStatus').value === PaymentStatus.BALANCE
  //                                       ? electricityBalance : this.form.get('electricBillStatus').value;
  //   roomTenants.waterBillStatus      = this.form.get('waterBillStatus').value === PaymentStatus.BALANCE
  //                                       ? waterBalnce : this.form.get('waterBillStatus').value;
  //   roomTenants.riceCookerBillStatus = this.form.get('riceCookerBillStatus').value === PaymentStatus.BALANCE
  //                                       ? riceCookerBalnce : this.form.get('riceCookerBillStatus').value;

  // }
  async showTenants(): Promise<void> {
    try {
      const roomByRoomNumber                = await this.getRoomByRoomNumber();
      this.pageRequest.filters.type         = roomByRoomNumber.data[0].type === RoomType.BEDSPACE ?
                                              FilterType.BEDSPACEROOMBYOBJECTID :
                                              FilterType.TRANSIENTPRIVATEROOMBYOBJECTID;
      this.pageRequest.filters.roomObjectId = roomByRoomNumber.data[0]._id;
      const roomByRoomType                  = await this.roomService.getRooms<Room>(this.pageRequest);
      this.setRoomTenants(roomByRoomType.data[0]);
    } catch (error) {}
  }
  tablePagination($event: PageEvent): void {
    // lenght
    // pageIndex
    // pagesize
    console.log($event);
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.tablePagination($event);
  }
}
