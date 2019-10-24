import { Injectable } from '@angular/core';
import { Entry } from '@gmrc/models';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private apiService: ApiService
  ) { }

  addEntry(body: Entry) {
    return this.apiService.post<Entry>('payment/createEntry', body);
  }
  updateEntry(body: Entry) {
    return this.apiService.put<Entry>('payment/createEntry', body);
  }

}
