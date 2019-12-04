import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PageRequest, RoomPayment } from '@gmrc/models';
import { FilterType } from '@gmrc/enums';
import { NotificationService, PaymentService } from '@gmrc/services';

@Component({
  selector: 'app-electric-bills',
  templateUrl: './electric-bills.component.html',
  styleUrls: ['./electric-bills.component.scss']
})
export class ElectricBillsComponent implements OnInit {
  isLoading = true;
  pageRequest = new PageRequest(null, null);
  electricBills: Array<{}> = [];
  constructor(
    private notificationService: NotificationService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.getMonthRoomPayment();
  }
  getElectricBills(roomPayments: Array<RoomPayment>): void {
    roomPayments.forEach( roomPayment => {
      const roomPaymentObj: {
        date: string,
        roomNumber: number,
        previousReading: Date,
        previousReadingKWUsed: number,
        presentReading: Date,
        presentReadingKWUsed: number,
        total: number,
        amountKWUsed: number,
        totalAmountElectricBill: number,
        electricBillInterest: string,
      } = {
        date: null,
        roomNumber: null,
        previousReading: null,
        previousReadingKWUsed: null,
        presentReading: null,
        presentReadingKWUsed: null,
        total: null,
        amountKWUsed: null,
        totalAmountElectricBill: null,
        electricBillInterest: null
      };
      roomPaymentObj.date                    = roomPayment.date;
      roomPaymentObj.roomNumber              = roomPayment.roomNumber;
      roomPaymentObj.previousReading         = roomPayment.previousReading;
      roomPaymentObj.previousReadingKWUsed   = roomPayment.previousReadingKWUsed;
      roomPaymentObj.presentReading          = roomPayment.presentReading;
      roomPaymentObj.presentReadingKWUsed    = roomPayment.presentReadingKWUsed;
      roomPaymentObj.total                   = roomPayment.total;
      roomPaymentObj.amountKWUsed            = roomPayment.amountKWUsed;
      roomPaymentObj.totalAmountElectricBill = roomPayment.totalAmountElectricBill;
      roomPaymentObj.electricBillInterest    = roomPayment.electricBillInterest;
      this.electricBills.push(roomPaymentObj);
    });
  }
  get date(): string {
    return moment().format('MM/YYYY');
  }
  async getMonthRoomPayment(): Promise<void> {
    try {
      this.pageRequest.filters.type = FilterType.ROOMPAYMENTSBYDATE;
      this.pageRequest.filters.date = this.date;
      const roomPayment = await this.paymentService.getRoomPayments<RoomPayment>(this.pageRequest);
      this.getElectricBills(roomPayment.data);
      this.isLoading = false;
    } catch (error) {
      this.notificationService.notifyFailed('Something went wrong');
      this.isLoading = false;
    }
  }
}
