import { Component, OnInit, ViewChild } from '@angular/core';
import { PageRequest, UnsettleBill } from '@gmrc/models';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { FilterType } from '@gmrc/enums';
import { Router } from '@angular/router';
import { RoomService, NotificationService, ObjectService } from '@gmrc/services';
import { ConfirmationDialogComponent, UnsettleBillAdvanceSearchComponent } from 'src/app/shared';

@Component({
  selector: 'app-unsettle-bill',
  templateUrl: './unsettle-bill.component.html',
  styleUrls: ['./unsettle-bill.component.scss']
})
export class UnsettleBillComponent implements OnInit {
  displayedColumns: string[] = [
    'roomNumber',
    'roomType',
    'tenants',
    'rentBalance',
    'electricBillBalance',
    'waterBillBalance',
    'riceCookerBillBalance',
    'actions',
  ];
  isLoading = true;
  pageRequest = new PageRequest(null, null);
  totalCount: number;
  dataSource = new MatTableDataSource<UnsettleBill>();
  pageSizeOptions: number[] = [10, 20, 30, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private router: Router,
    private roomService: RoomService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private objectService: ObjectService
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLUNSETTLEBILLS;
    this.getUnsettleBills();
  }
  async getUnsettleBills(): Promise<void> {
    try {
      const unsettleBills       = await this.roomService.getUnsettleBills(this.pageRequest);
      this.totalCount           = unsettleBills.totalCount;
      this.dataSource.data      = unsettleBills.data as UnsettleBill[];
      this.dataSource.paginator = this.paginator;
      this.isLoading            = false;
    } catch (error) {
    }
  }
  addUnsettleBill(): void {
    this.router.navigate(['room/unsettle-bill/add']);
  }
  updateUnsettleBill(objectId: string): void {
    this.router.navigate([`room/update-unsettle-bill/${objectId}`]);
  }
  deleteUnsettleBill(objectId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Unsettled Bill',
        content: `Are you sure you want to remove this unsettled bill?`
      }
    });
    dialogRef.afterClosed().subscribe( removeUnsettleBill => {
      if (removeUnsettleBill) {
        this.roomService.removeUnsettleBill(objectId)
        .then( unsettleBill => {
          this.notificationService.notifySuccess(`Removed room number ${unsettleBill.roomNumber} unsettled bill`);
          this.getUnsettleBills();
        })
        .catch ( err => {
          this.notificationService.notifyFailed('Something went wrong');
        });
      }
    });
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      UnsettleBillAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        const filterType = FilterType.ADVANCESEARCHUNSETTLEBILL;
        this.pageRequest.filters.type = filterType;
        this.pageRequest.filters.unsettleBillFilter = searchResult;
        this.getUnsettleBills();
      }
    });
  }
  displayAllUnsettleBills(): void {
    this.pageRequest.filters.type = FilterType.ALLUNSETTLEBILLS;
    this.getUnsettleBills();
  }
}
