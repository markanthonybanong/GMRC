import { Injectable } from '@angular/core';
import { InquiryStatus } from '@gmrc/enums';

@Injectable({
  providedIn: 'root'
})
export class InquiryEnumService {

  constructor() { }
  get inquiryStatuses(): Array<string> {
    return Object.keys(InquiryStatus).map(function(key) {
      return InquiryStatus[key];
    });
  }
}
