import { Injectable } from '@angular/core';
import { RoomType, RoomStatus, HasAirCon, DeckStatus, TransientBedspaceStatus } from '@gmrc/enums';

@Injectable({
  providedIn: 'root'
})
export class RoomEnumService {

  constructor() { }
  get roomType(): Array<string> {
    return Object.keys(RoomType).map(function(key) {
      return RoomType[key];
    });
  }
  get hasAircon(): Array<string> {
    return Object.keys(HasAirCon).map(function(key) {
      return HasAirCon[key];
    });
  }
  get roomStatus(): Array<string> {
    return Object.keys(RoomStatus).map(function(key) {
      return RoomStatus[key];
    });
  }
  get deckStatus(): Array<string> {
    return Object.keys(DeckStatus).map(function(key) {
      return DeckStatus[key];
    });
  }
  get transientBedspaceStatus(): Array<string> {
    return Object.keys(TransientBedspaceStatus).map(function(key) {
      return TransientBedspaceStatus[key];
    });
  }
}
