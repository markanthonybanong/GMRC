import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSelect } from '@angular/material';
import { PageRequest, RoomAccount, Filter, Room } from '@gmrc/models';
import { FormBuilder } from '@angular/forms';
import { RoomService, RoomAccountService } from '@gmrc/services';
import { FilterType } from '@gmrc/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-account',
  templateUrl: './room-account.component.html',
  styleUrls: ['./room-account.component.scss']
})
export class RoomAccountComponent implements OnInit {
  displayedColumns: string [] = [
    'roomNumber',
    'password',
    'action'
  ];
  pageSizeOptions: number[] = [10, 20, 30, 40];
  isLoading = true;
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  totalCount: number;
  dataSource = new MatTableDataSource<RoomAccount>();
  form = this.formBuilder.group({
    roomNumbers: null,
  });
  roomNumbers: Array<number> = [];
  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private roomAccountService: RoomAccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLROOMACCOUNTS;
    this.getRoomNumbers();
    this.getRoomAccounts();
  }
  async getRoomNumbers(): Promise<void> {
    try {
      this.pageRequest.filters.type = FilterType.ALLROOMS;
      const rooms = await this.roomService.getRooms<Room>(this.pageRequest);
      rooms.data.forEach(room => {
        this.roomNumbers.push(room.number);
      });
    } catch (error) {
    }
  }
  async getRoomAccounts(): Promise<void> {
    try {
      const roomAccounts   = await this.roomAccountService.getRoomAccounts<RoomAccount>(this.pageRequest);
      this.totalCount      = roomAccounts.totalCount;
      this.dataSource.data = roomAccounts.data as RoomAccount[];
      this.isLoading       = false;
    } catch (error) {
    }
  }
  roomNumbersToggle($event: MatSelect): void {
    if ($event.value) {
      this.pageRequest.filters.type       = FilterType.ROOMACCOUNTBYROOMNUMBER;
      this.pageRequest.filters.roomNumber = $event.value;
      this.getRoomAccounts();
    }
  }
  displayAllRoomAccounts(): void {
    this.pageRequest.filters.type = FilterType.ALLROOMACCOUNTS;
    this.getRoomAccounts();
  }
  addRoomAccount(): void {
    this.router.navigate(['room-account/add']);
  }
  updateRoomAccount(objectId: string): void {
    this.router.navigate([`room-account/update/${objectId}`]);
  }
}
