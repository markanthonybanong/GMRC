import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
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
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  totalCount: number;
  dataSource = new MatTableDataSource<Room>();

  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private router: Router,
    private objectService: ObjectService,

    ) { }
  ngOnInit() {
    this.pageRequest.filters.type = FilterType.TRANSIENTPRIVATEROOMS;
    this.getTransientPrivateRooms();
  }
  getTransientPrivateRooms(): void {
    this.roomService.getRooms<Room>(this.pageRequest)
      .then( rooms => {
        this.totalCount = rooms.totalCount;
        this.dataSource.data = rooms.data as Room[];
        this.isLoading = false;
      })
      .catch ( err => {
      });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.pageRequest.page = $event.pageIndex + 1;
    this.pageRequest.limit = $event.pageSize;
    this.getTransientPrivateRooms();
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
        this.pageRequest.filters.type       = FilterType.ADVANCESEARCHTRANSIENTPRIVATEROOMS;
        this.pageRequest.filters.roomFilter = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.getTransientPrivateRooms();
      }
    });
  }
  displayAllTransientPrivateRooms(): void {
    this.pageRequest.filters = {type: FilterType.TRANSIENTPRIVATEROOMS};
    this.getTransientPrivateRooms();
  }
}
