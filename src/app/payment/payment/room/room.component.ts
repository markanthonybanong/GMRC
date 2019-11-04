import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageRequest, RoomPayment } from '@gmrc/models';
import { MatTableDataSource } from '@angular/material';
import { PaymentService } from '@gmrc/services';

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
        console.log(roomPayments);
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
}
