import { Injectable } from '@angular/core';
import { Entry, PageRequest, PageData, RoomPayment, Penalty } from '@gmrc/models';
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
    return this.apiService.put<Entry>(`payment/updateEntry/${body._id}`, body);
  }
  getEntries<T>(pageRequest: PageRequest) {
    return this.apiService.post<PageData<T>>('payment/entry/page', pageRequest);
  }
  addRoomPayment(body: RoomPayment) {
    return this.apiService.post<RoomPayment>('payment/createRoomPayment', body);
  }
  getRoomPayments<T>(pageRequest: PageRequest) {
    return this.apiService.post<PageData<T>>('payment/roomPayment/page', pageRequest);
  }
  updateRoomPayment(body: RoomPayment) {
    return this.apiService.put<RoomPayment>(`payment/updateRoomPayment/${body._id}`, body);
  }
  addPenalty(body: Penalty) {
    return this.apiService.post<Penalty>('payment/createPenalty', body);
  }
  updatePenalty(body: Penalty) {
    return this.apiService.put<Penalty>('payment/updatePenalty', body);
  }
  getPenalties<T>(pageRequest: PageRequest) {
    return this.apiService.post<PageData<T>>('payment/penalty/page', pageRequest);
  }
  removePenalty(objectId: string) {
    return this.apiService.delete<Penalty>(`payment/removePenalty/${objectId}`);
  }
  
}
