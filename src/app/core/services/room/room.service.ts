import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Room, Bedspace, PageData, PageRequest, TenantData, DeckToSend, UnsettleBill } from '@gmrc/models';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor( private apiService: ApiService) { }
  addRoom(body: Room) {
    return this.apiService.post<Room>('room/createRoom', body);
  }
  updateRoom(body: Room) {
    return this.apiService.put<Room>('room/updateRoom', body);
  }
  addBed(body: Bedspace) {
    return this.apiService.post<Bedspace>('room/createBed', body);
  }
  addDeckInBed(body: Bedspace) {
    return this.apiService.post<Bedspace>('room/createDeckInBed', body);
  }
  updateDeckInBed(body: Bedspace) {
    return this.apiService.put<Bedspace>('room/updateDeckInBed', body);
  }
  addUpdateAwayInDeck(body: object) {
    return this.apiService.put<Bedspace>('room/addUpdateAwayInDeck', body);
  }
  removeBedSpace(bedToRemove: object) {
    return this.apiService.put<Bedspace>('room/removeBedspace/', bedToRemove);
  }
  removeDeckInBedspace(deckToRemove: object) {
    return this.apiService.put<Bedspace>('room/removeDeckInBedspace', deckToRemove);
  }
  getRooms<T>(pageRequest: PageRequest = null) {
    return this.apiService.post<PageData<T>>('room/page', pageRequest);
  }
  addTenantInTransientPrivateRoom(body: TenantData) {
    return this.apiService.post<Room>('room/addTenantInTransientPrivateRoom', body);
  }
  updateTenantInTransientPrivateRoom(body: TenantData) {
    return this.apiService.put<Room>('room/updateTenantInTransientPrivateRoom', body);
  }
  removeTenantInTransientPrivateRoom(body: TenantData) {
    return this.apiService.put<Room>('room/removeTenantInTransientPrivateRoom', body);
  }
  getUnsettleBills<T>(pageRequest: PageRequest) {
    return this.apiService.post<PageData<T>>('room/unsettle-bill/page', pageRequest);
  }
  updateUnsettleBill(body: UnsettleBill) {
    return this.apiService.put<UnsettleBill>('room/unsettle-bill', body);
  }
  addUnsettleBill(body: UnsettleBill) {
    return this.apiService.post<UnsettleBill>('room/unsettle-bill', body);
  }
  removeTenantInUnsettleBill(body: object) {
    return this.apiService.put<UnsettleBill>('room/removeTenantInUnsettleBill', body);
  }
  removeUnsettleBill(objectId: string) {
    return this.apiService.delete<UnsettleBill>(`room/removeUnsettleBill/${objectId}`);
  }
}
