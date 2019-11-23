import { Component, OnInit } from '@angular/core';
import { PaymentService } from '@gmrc/services';
import { PageRequest, RoomPayment, RoomPaymentForPrint, RoomTenant, MonthRoomPayment } from '@gmrc/models';
import { FilterType, RoomType } from '@gmrc/enums';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';
import groupBy from 'lodash/groupBy';
import toArray from 'lodash/toArray';
import find from 'lodash/find';
import unionBy from 'lodash/unionBy';
@Component({
  selector: 'app-room-bills',
  templateUrl: './room-bills.component.html',
  styleUrls: ['./room-bills.component.scss']
})
export class RoomBillsComponent implements OnInit {
  pageRequest = new PageRequest(null, null);
  dates = [
    {date: moment().format('MM/YYYY')},
    {date: moment().subtract(1, 'months').format('MM/YYYY')},
    {date: moment().subtract(2, 'months').format('MM/YYYY')},
    {date: moment().subtract(3, 'months').format('MM/YYYY')},
  ];
  dataSource = new MatTableDataSource<RoomPaymentForPrint>();
  isLoading = true;
  displayedColumns: string[] = [
    'roomNumber',
    'tenants',
    'dueDates',
    'monthMinusThreeAdvanceRentals',
    'monthMinusThreeCurrent',
    'monthMinusThreeWater',
    'monthMinusThreeRiceCooker',
    'monthMinusTwoAdvanceRentals',
    'monthMinusTwoCurrent',
    'monthMinusTwoWater',
    'monthMinusTwoRiceCooker',
    'monthMinusOneAdvanceRentals',
    'monthMinusOneCurrent',
    'monthMinusOneWater',
    'monthMinusOneRiceCooker',
    'currentMonthAdvanceRentals',
    'currentMonthCurrent',
    'currentMonthWater',
    'currentMonthRiceCooker'
  ];
  constructor(
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.pageRequest.filters.type = FilterType.ROOMPAYMENTSINFOURMONTHS;
    this.pageRequest.filters.roomPaymentFilter = this.dates;
    this.getRoomPayments();
  }
  groupRoomPaymentsByRoomNumber(roomPayments: Array<RoomPayment>): Array<Array<RoomPayment>> {
    return toArray(groupBy(roomPayments, roomPayment => roomPayment.roomNumber));
  }
  getAllRoomTenantsInFourMonths(roomPayments: Array<Array<RoomPayment>>, roomPaymentsIndex: number): Array<RoomTenant> {
    let monthMinusThreeTenants: Array<RoomTenant> = [];
    let monthMinusTwoTenants: Array<RoomTenant>   = [];
    let monthMinusOneTenants: Array<RoomTenant>   = [];
    let currentMonthTenants: Array<RoomTenant>    = [];

    roomPayments[roomPaymentsIndex].forEach( (monthRoomPayment, roomPaymentIndex) => {
        if (monthRoomPayment.date === moment().subtract(3, 'months').format('MM/YYYY')) {
          monthMinusThreeTenants = monthRoomPayment.roomTenants;
        } else if (monthRoomPayment.date === moment().subtract(2, 'months').format('MM/YYYY')) {
          monthMinusTwoTenants = monthRoomPayment.roomTenants;
        } else if (monthRoomPayment.date === moment().subtract(1, 'months').format('MM/YYYY')) {
          monthMinusOneTenants = monthRoomPayment.roomTenants;
        } else if (monthRoomPayment.date === moment().format('MM/YYYY')) {
          currentMonthTenants = monthRoomPayment.roomTenants;
        }

    });

    return unionBy(monthMinusThreeTenants, monthMinusTwoTenants, monthMinusOneTenants, currentMonthTenants, 'name');
  }
  getRoomNumbers(roomPayments: Array<Array<RoomPayment>>): Array<number> {
    const roomNumbers: Array<number> = [];
    for (let roomPaymentsIndex = 0; roomPaymentsIndex < roomPayments.length; roomPaymentsIndex++) {
      for ( let roomPaymentIndex = 0;  roomPaymentIndex < roomPayments[roomPaymentsIndex].length; roomPaymentIndex++) {
        if (roomPaymentIndex === 0 ) {
          roomNumbers.push(roomPayments[roomPaymentsIndex][roomPaymentIndex].roomNumber);
          break;
        }
      }
    }
    return roomNumbers;
  }
  getMonthRoomPayment(
    roomPayments: Array<Array<RoomPayment>>,
    roomTenants: Array<RoomTenant>,
    roomPaymentsIndex: number,
    date: string
  ): MonthRoomPayment {
    let monthPayment: MonthRoomPayment =  {
                                              advanceRental: [],
                                              electricBill: {
                                                value: null,
                                                status: null,
                                                balance: null,
                                              },
                                              waterBill: {
                                                value: null,
                                                status: null,
                                                balance: null,
                                              },
                                              riceCookerBill: {
                                                value: null,
                                                status: null,
                                                balance: null,
                                              }
                                          };
    const monthsRoomPaymentInRoom = roomPayments[roomPaymentsIndex];
    const monthRoomPayment: RoomPayment  = find(monthsRoomPaymentInRoom, {date: date});


    if (monthRoomPayment !== undefined) {
      roomTenants.forEach( (roomTenant, roomTenantIndex) => {
        let isTenantNotFound = true;
        monthRoomPayment.roomTenants.forEach((roomPaymentTenant, roomPaymentTenantIndex) => {
          if (roomTenant.name === roomPaymentTenant.name) {
            const advanceRental = {
                                    name: roomPaymentTenant.name,
                                    value: roomPaymentTenant.rent,
                                    rentStatus: {
                                      value: roomPaymentTenant.rentStatus.value,
                                      balance: roomPaymentTenant.rentStatus.balance,
                                    }
                                  };
            isTenantNotFound = false;
            monthPayment.advanceRental.push(advanceRental);
          }
        });
        if (isTenantNotFound && monthRoomPayment.roomType === RoomType.BEDSPACE) {
          const advanceRental = {
            name: roomTenant.name,
            value: 0,
            rentStatus: {
              value: null,
              balance: null,
            }
          };
          monthPayment.advanceRental.push(advanceRental);
        }
      });
      monthPayment.electricBill.value     = monthRoomPayment.totalAmountElectricBill;
      monthPayment.electricBill.status    = monthRoomPayment.electricBillStatus;
      monthPayment.electricBill.balance   = monthRoomPayment.electricBillBalance.length > 0
                                            ? monthRoomPayment.electricBillBalance[0].balance
                                            : null;

      monthPayment.waterBill.value        = monthRoomPayment.waterBill;
      monthPayment.waterBill.status       = monthRoomPayment.waterBillStatus;
      monthPayment.waterBill.balance      = monthRoomPayment.waterBillBalance.length > 0
                                            ? monthRoomPayment.waterBillBalance[0].balance
                                            : null;

      monthPayment.riceCookerBill.value   = monthRoomPayment.riceCookerBill;
      monthPayment.riceCookerBill.status  = monthRoomPayment.riceCookerBillStatus;
      monthPayment.riceCookerBill.balance = monthRoomPayment.riceCookerBillBalance.length > 0
                                            ? monthRoomPayment.riceCookerBillBalance[0].balance
                                            : null;
    } else {
      monthPayment = null;
    }
   return monthPayment;
  }
  get monthMinusThree(): string {
    return moment().subtract(3, 'months').format('MMMM YYYY');
  }
  get monthMinusTwo(): string {
    return moment().subtract(2, 'months').format('MMMM YYYY');
  }
  get monthMinusOne(): string {
    return moment().subtract(1, 'months').format('MMMM YYYY');
  }
  get currentMonth(): string {
    return moment().format('MMMM YYYY');
  }
  setMonthsRoomPayment(roomPayments: Array<RoomPayment>): void {
    const roomPaymentsForPrint: Array<RoomPaymentForPrint> = [];
    const roomPaymentsByRoomNumber = this.groupRoomPaymentsByRoomNumber(roomPayments);
    const roomNumbers = this.getRoomNumbers(roomPaymentsByRoomNumber);

    roomPaymentsByRoomNumber.forEach( (monthsRoomPayment, index) => {
      const roomPaymentForPrint: RoomPaymentForPrint = {
                                                          roomNumber: null,
                                                          tenants: null,
                                                          dueDates: null,
                                                          monthMinusThree: null,
                                                          monthMinusTwo: null,
                                                          monthMinusOne: null,
                                                          currentMonth: null,
                                                       };

      const roomTenants                   = this.getAllRoomTenantsInFourMonths(roomPaymentsByRoomNumber, index);
      roomPaymentForPrint.roomNumber      = roomNumbers[index];
      roomPaymentForPrint.tenants         = roomTenants;
      roomPaymentForPrint.dueDates        = roomTenants;

      roomPaymentForPrint.monthMinusThree = this.getMonthRoomPayment(
                                                                      roomPaymentsByRoomNumber,
                                                                      roomTenants,
                                                                      index,
                                                                      moment().subtract(3, 'months').format('MM/YYYY'),
                                                                    );
      roomPaymentForPrint.monthMinusTwo   = this.getMonthRoomPayment(
                                                                      roomPaymentsByRoomNumber,
                                                                      roomTenants,
                                                                      index,
                                                                      moment().subtract(2, 'months').format('MM/YYYY'),
                                                                    );
      roomPaymentForPrint.monthMinusOne   = this.getMonthRoomPayment(
                                                                      roomPaymentsByRoomNumber,
                                                                      roomTenants,
                                                                      index,
                                                                      moment().subtract(1, 'months').format('MM/YYYY'),
                                                                    );
      roomPaymentForPrint.currentMonth   = this.getMonthRoomPayment(
                                                                      roomPaymentsByRoomNumber,
                                                                      roomTenants,
                                                                      index,
                                                                      moment().format('MM/YYYY'),
                                                                    );
      roomPaymentsForPrint.push(roomPaymentForPrint);
    });

    this.dataSource.data = roomPaymentsForPrint;
    console.log('room payments for prints ', roomPaymentsForPrint);
    // console.log('room tenants ', this.getRoomTenantsForEachMonth(roomPaymentsByRoomNumber, 1));

  }
  getRoomPayments(): void {
    this.paymentService.getRoomPayments<RoomPayment>(this.pageRequest)
      .then(roomPayments => {
        this.setMonthsRoomPayment(roomPayments.data);
        this.isLoading = false;
      })
      .catch( err => {});
  }
}
