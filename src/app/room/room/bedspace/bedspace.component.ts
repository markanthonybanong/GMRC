import { Component, OnInit, ViewChild } from '@angular/core';
import { PageRequest, Bedspace, Filter } from '@gmrc/models';
import { MatTableDataSource, PageEvent, MatDialog, MatPaginator } from '@angular/material';
import { FilterType } from '@gmrc/enums';
import { RoomService, ObjectService, LocalStorageService } from '@gmrc/services';
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
  pageSizeOptions: number[] = [10, 20, 30, 40];
  isLoading = true;
  pageRequest = new PageRequest(null, null);
  totalCount: number;
  dataSource = new MatTableDataSource<Bedspace>();
  roomSearch = ['number', 'floor', 'aircon'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private router: Router,
    private objectService: ObjectService,
    private localStorageService: LocalStorageService,
    ) {}

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.BEDSPACEROOMS;
    this.getBedspaceRooms();
  }

  displayPreviousPage(): void {
    const filterType = this.localStorageService.getItem('bedspaceRoomFilterType');
    const filter     = this.localStorageService.getItem('bedspaceRoomFilter');
    const page       = this.localStorageService.getItem('bedspaceRoomPage');

    if ( filter !== null ) {
      this.pageRequest.filters  = filter;
    }
    if ( filterType !== null ) {
      this.pageRequest.filters.type = filterType;
    }
    if ( page !== null) {
      this.paginator.pageIndex = page;
    }
  }
  getBedspaceRooms(): void {
    this.displayPreviousPage();
    this.roomService.getRooms<Bedspace>(this.pageRequest)
      .then( rooms => {
        this.totalCount = rooms.totalCount;
        this.dataSource.data = rooms.data as Bedspace[];
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      })
      .catch( err => {
      });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.localStorageService.setItem('bedspaceRoomPage', $event.pageIndex);
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
        const filter = this.mergeSearchResult(searchResult);
        this.pageRequest.filters = filter;
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHBEDSPACEROOMS;
        this.localStorageService.setItem('bedspaceRoomFilterType', FilterType.ADVANCESEARCHBEDSPACEROOMS);
        this.localStorageService.setItem('bedspaceRoomFilter', filter);
        this.getBedspaceRooms();
      }
    });
  }
  udpateBedspace(roomObjectId: string): void {
    this.router.navigate([`room/update-bedspace/${roomObjectId}`]);
  }
  displayAllBedspaceRooms(): void {
    this.localStorageService.remove('bedspaceRoomFilterType');
    this.localStorageService.remove('bedspaceRoomFilter');
    this.localStorageService.remove('bedspaceRoomPage');
    this.pageRequest.filters = {type: FilterType.BEDSPACEROOMS};
    this.getBedspaceRooms();
  }
}
