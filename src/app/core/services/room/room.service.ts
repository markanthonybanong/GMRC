import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Room, Bedspace, PageData, PageRequest, TenantData } from '@gmrc/models';

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
  addBedspace(body: Bedspace) {
    return this.apiService.post<Bedspace>('room/createBedspace', body);
  }
  updateBedspace(body: Bedspace) {
    return this.apiService.put<Bedspace>('room/updateBedspace', body);
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
}
