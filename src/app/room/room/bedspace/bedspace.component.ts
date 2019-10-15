import { Component, OnInit } from '@angular/core';
import { PageRequest, Bedspace, Filter } from '@gmrc/models';
import { MatTableDataSource, PageEvent, MatDialog } from '@angular/material';
import { FilterType } from '@gmrc/enums';
import { RoomService, ObjectService } from '@gmrc/services';
import { BedspaceAdvanceSearchComponent } from '@gmrc/shared';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-bedspace',
  templateUrl: './bedspace.component.html',
  styleUrls: ['./bedspace.component.scss']
})
export class BedspaceComponent implements OnInit {
  displayedColumns: string[] = [
    'roomNumber',
    'floorNumber',
    'aircon',
    'bed',
    'actions',
  ];
  pageSizeOptions: number[] = [5, 10, 15];
  isLoading = true;
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  totalCount: number;
  dataSource = new MatTableDataSource<Bedspace>();
  roomSearch = ['number', 'floor', 'aircon'];
  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private router: Router,
    private objectService: ObjectService
    ) {}

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.BEDSPACEROOMS;
    this.getBedspaceRooms();
  }
  getBedspaceRooms(): void {
    this.roomService.getRooms<Bedspace>(this.pageRequest)
      .then( rooms => {
        this.totalCount = rooms.totalCount;
        this.dataSource.data = rooms.data as Bedspace[];
        this.isLoading = false;
      })
      .catch( err => {
      });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.pageRequest.limit = $event.pageSize;
    this.pageRequest.page = $event.pageIndex + 1;
    this.getBedspaceRooms();
  }
  convertDateToDateString(date): string {
    return moment(date).format('dddd LL');
  }
  mergeSearchResult(searchResult: object): object {
    const modifiedSearchResult = { roomFilter: {}, bedspaceFilter: {}};
    Object.entries(searchResult).forEach(entry => {
      const key   = entry[0];
      const value = entry[1];
      if (this.roomSearch.includes(key)) {
        modifiedSearchResult.roomFilter[key] = value;
      } else {
        modifiedSearchResult.bedspaceFilter[key] = value;
      }
    });
    return modifiedSearchResult;
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      BedspaceAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        this.pageRequest.filters = this.mergeSearchResult(searchResult);
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHBEDSPACEROOMS;
        this.getBedspaceRooms();
      }
    });
  }
  udpateBedspace(roomObjectId: string): void {
    this.router.navigate([`room/update-bedspace/${roomObjectId}`]);
  }
}
