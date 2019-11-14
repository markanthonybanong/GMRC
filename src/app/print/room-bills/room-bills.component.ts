import { Component, OnInit } from '@angular/core';
import { PaymentService } from '@gmrc/services';
import { PageRequest, RoomPayment, RoomPaymentForPrint } from '@gmrc/models';
import { FilterType } from '@gmrc/enums';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';
import groupBy from 'lodash/groupBy';
import toArray from 'lodash/toArray';
import union from 'lodash/union';
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
    {date: moment().subtract(2, 'months').format('MM/YYYY')}
  ];
  dataSource = new MatTableDataSource<RoomPaymentForPrint>();
  isLoading = true;
  displayedColumns: string[] = [
    'roomNumber',
    'date',
    'electricBillStatus',
    'waterBillStatus',
    'riceCookerBillStatus',
    'rentStatus',
    'actions'
  ];
  constructor(
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.pageRequest.filters.type = FilterType.ROOMPAYMENTSINTHREEMONTHS;
    this.pageRequest.filters.roomPaymentFilter = this.dates;
    this.getRoomPayments();
  }
  groupRoomPaymentsByRoomNumber(roomPayments: Array<RoomPayment>): Array<Array<RoomPayment>> {
    return toArray(groupBy(roomPayments, roomPayment => roomPayment.roomNumber));
  }
  getTenantsInRooms(roomPayments: Array<Array<RoomPayment>>): Array<Array<string>> {
    const roomsTenant: Array<Array<string>> = [];
    let names: Array<string>                = [];

    roomPayments.forEach(monthsRoomPayment => {
      monthsRoomPayment.forEach(monthRoomPayment => {
         monthRoomPayment.roomTenants.forEach( roomTenant => {
         //   names = union(names, roomTenant.names);
         });
      });
      roomsTenant.push(names);
      names = [];
    });
    return roomsTenant;
  }
  getDueDatesInRooms(roomPayments: Array<Array<RoomPayment>>): Array<Array<string>> {
    const roomsDueDates: Array<Array<string>> = [];
    let dueDates: Array<string>                = [];

    roomPayments.forEach(monthsRoomPayment => {
      monthsRoomPayment.forEach(monthRoomPayment => {
         monthRoomPayment.roomTenants.forEach( roomTenant => {
      //      dueDates = union(dueDates, roomTenant.dueRentDates);
         });
    });
    roomsDueDates.push(dueDates);
    dueDates = [];
    });
    return roomsDueDates;
  }
  setMonthsRoomPayment(roomPayments: Array<RoomPayment>): void {
    let threeMonthsRoomPayment: Array<RoomPaymentForPrint> = [];
    const groupRoomPayments = this.groupRoomPaymentsByRoomNumber(roomPayments);
    const tenants           = this.getTenantsInRooms(groupRoomPayments);
    const dueDates          = this.getDueDatesInRooms(groupRoomPayments);
    console.log(tenants);
    console.log(dueDates);
    let roomPaymentForPrint: RoomPaymentForPrint;

    // this.groupRoomPaymentsByRoomNumber(roomPayments).forEach( (monthsRoomPayment, firstIndex) => {
    //   monthsRoomPayment.forEach( (monthRoomPayment, secondIndex) => {
    //     if (secondIndex === 0) {
    //       roomPaymentForPrint.roomNumber = monthRoomPayment.roomNumber;
    //       roomPaymentForPrint.tenants    = tenants[firstIndex];
    //     }
    //   });
    // });

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
