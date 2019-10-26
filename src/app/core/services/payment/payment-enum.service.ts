import { Injectable } from '@angular/core';
import { KeyStatus, PaymentStatus } from '@gmrc/enums';
@Injectable({
  providedIn: 'root'
})
export class PaymentEnumService {

  constructor() { }
  get keyStatuses(): Array<string> {
    return Object.keys(KeyStatus).map(function(key) {
      return KeyStatus[key];
    });
  }
  get paymentStatuses(): Array<string> {
    return Object.keys(PaymentStatus).map(function(key) {
      return PaymentStatus[key];
    });
  }
}
