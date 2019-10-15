import { Injectable } from '@angular/core';
import { RoomType, RoomStatus, HasAirCon, DeckStatus, TransientBedspaceStatus } from '@gmrc/enums';

@Injectable({
  providedIn: 'root'
})
export class RoomEnumService {

  get roomType() {
    return Object.keys(RoomType).map(function(key) {
      return RoomType[key];
    });
  }

  get hasAircon() {
    return Object.keys(HasAirCon).map(function(key) {
      return HasAirCon[key];
    });
  }

  get roomStatus() {
    return Object.keys(RoomStatus).map(function(key) {
      return RoomStatus[key];
    });
  }

  get deckStatus() {
    return Object.keys(DeckStatus).map(function(key) {
      return DeckStatus[key];
    });
  }

  get transientBedspaceStatus() {
    return Object.keys(TransientBedspaceStatus).map(function(key) {
      return TransientBedspaceStatus[key];
    });
  }


  constructor() { }
}
