import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageRequest, RoomPayment } from '@gmrc/models';
import { MatTableDataSource } from '@angular/material';
import { PaymentService } from '@gmrc/services';
import { PaymentStatus } from '@gmrc/enums';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  pageSizeOptions: number[] = [5, 10, 15];
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  dataSource = new MatTableDataSource<RoomPayment>();
  totalCount: number;
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
    private router: Router,
    private paymentService: PaymentService,
    ) { }

  ngOnInit() {
    this.getRoomPayments();
  }
  addRoomPayment(): void {
    this.router.navigate(['payment/add-room-payment']);
  }
  getRoomPayments(): void {
    this.paymentService.getRoomPayments<RoomPayment>(this.pageRequest)
      .then( roomPayments => {
        this.totalCount = roomPayments.totalCount;
        this.dataSource.data = roomPayments.data as RoomPayment[];
        this.isLoading = false;
      })
      .catch( err => {

      });
  }
  updateRoomPayment(roomPaymentObjectId: string): void {
    this.router.navigate([`payment/update-room-payment/${roomPaymentObjectId}`]);
  }
  setRoomStatus(statuses: Array<{value: string, balance?: number}>): Array<string> {
    const tenantstatuses: Array<string> = [];
    const roomStatuses:   Array<string> = [];
    statuses.forEach(status => {
      tenantstatuses.push(status.value);
    });
     if (tenantstatuses.includes(PaymentStatus.PAID)) {
       roomStatuses.push(PaymentStatus.PAID);
     }
     if (tenantstatuses.includes(PaymentStatus.UNPAID)) {
       roomStatuses.push(PaymentStatus.UNPAID);
     }
     if (tenantstatuses.includes(PaymentStatus.BALANCE)) {
       roomStatuses.push(PaymentStatus.BALANCE);
     }
     if (tenantstatuses.includes(PaymentStatus.NONE)) {
       roomStatuses.push(PaymentStatus.NONE);
     }
     return roomStatuses;
  }
}
