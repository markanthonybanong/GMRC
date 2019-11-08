import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog,
   MatTableDataSource, MatSort, PageEvent, MatPaginator } from '@angular/material';
import { TransientPrivateAdvanceSearchComponent } from '@gmrc/shared';
import { RoomService, ObjectService, LocalStorageService } from '@gmrc/services';
import { PageRequest, Room } from '@gmrc/models';
import { RoomType, FilterType } from '@gmrc/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transient-private',
  templateUrl: './transient-private.component.html',
  styleUrls: ['./transient-private.component.scss']
})
export class TransientPrivateComponent implements OnInit {
  displayedColumns: string[] = ['roomNumber', 'floorNumber', 'roomType', 'aircon', 'roomStatus', 'dueRentDate', 'tenant', 'actions'];
  pageSizeOptions: number[] = [10, 20, 30, 40];
  isLoading = true;
  pageRequest = new PageRequest(null, null);
  totalCount: number;
  dataSource = new MatTableDataSource<Room>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private router: Router,
    private objectService: ObjectService,
    private localStorageService: LocalStorageService,
    ) { }
  ngOnInit() {
    this.pageRequest.filters.type = FilterType.TRANSIENTPRIVATEROOMS;
    this.getTransientPrivateRooms();
  }
  displayPreviousPage(): void {
    const filterType = this.localStorageService.getItem('transientPrivateRoomFilterType');
    const filter     = this.localStorageService.getItem('transientPrivateRoomFilter');
    const page       = this.localStorageService.getItem('transientPrivateRoomPage');
    if ( filterType !== null ) {
      this.pageRequest.filters.type = filterType;
    }
    if ( filter !== null ) {
      this.pageRequest.filters.roomFilter = filter;
    }
    if ( page !== null) {
      this.paginator.pageIndex = page;
    }
  }
  getTransientPrivateRooms(): void {
    this.displayPreviousPage();
    this.roomService.getRooms<Room>(this.pageRequest)
      .then( rooms => {
        this.totalCount = rooms.totalCount;
        this.dataSource.data = rooms.data as Room[];
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      })
      .catch ( err => {
      });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.localStorageService.setItem('transientPrivateRoomPage', $event.pageIndex);
  }
  updateTransientPrivateRoom(roomObjectId: string ): void {
    this.router.navigate([`room/update-private-transient/${roomObjectId}`]);
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      TransientPrivateAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult !== undefined) {
        const filterType = FilterType.ADVANCESEARCHTRANSIENTPRIVATEROOMS;
        const filter     = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHTRANSIENTPRIVATEROOMS;
        this.pageRequest.filters.roomFilter = filter;
        this.localStorageService.setItem('transientPrivateRoomFilterType', filterType);
        this.localStorageService.setItem('transientPrivateRoomFilter', filter);
        this.getTransientPrivateRooms();
      }
    });
  }
  displayAllTransientPrivateRooms(): void {
    this.localStorageService.remove('transientPrivateRoomFilterType');
    this.localStorageService.remove('transientPrivateRoomFilter');
    this.localStorageService.remove('transientPrivateRoomPage');
    this.pageRequest.filters = {type: FilterType.TRANSIENTPRIVATEROOMS};
    this.getTransientPrivateRooms();
  }
}
