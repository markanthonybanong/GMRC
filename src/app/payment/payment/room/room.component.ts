import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageRequest, RoomPayment } from '@gmrc/models';
import { MatTableDataSource, MatDialog, PageEvent, MatPaginator } from '@angular/material';
import { PaymentService, ObjectService, LocalStorageService } from '@gmrc/services';
import { PaymentStatus, FilterType } from '@gmrc/enums';
import { RoomPaymentAdvanceSearchComponent } from '@gmrc/shared';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit  {
  pageSizeOptions: number[] = [10, 20, 30, 40];
  pageRequest = new PageRequest(null, null);
  dataSource = new MatTableDataSource<RoomPayment>();
  totalCount: number;
  isLoading = true;
  displayedColumns: string[] = [
    'roomNumber',
    'date',
    'electricBillStatus',
    'waterBillStatus',
    'riceCookerBillStatus',
    'rentStatus',
    'actions'
  ];
  usedPageRequestFilter: PageRequest = {filters: {}, page: null, limit: null};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private objectService: ObjectService,
    private localStorageService: LocalStorageService
    ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLROOMPAYMENTS;
    this.getRoomPayments();
  }
  addRoomPayment(): void {
    this.router.navigate(['payment/add-room-payment']);
  }
  displayPreviousPage(): void {
    const filterType = this.localStorageService.getItem('roomPaymentFilterType');
    const filter     = this.localStorageService.getItem('roomPaymentFilter');
    const page       = this.localStorageService.getItem('roomPaymentPage');

    if ( filterType !== null ) {
      this.pageRequest.filters.type = filterType;
    }
    if ( filter !== null ) {
      this.pageRequest.filters.roomPaymentFilter = filter;
    }
    if ( page !== null) {
      this.paginator.pageIndex = page;
    }
  }
  getRoomPayments(): void {
    this.displayPreviousPage();
    this.paymentService.getRoomPayments<RoomPayment>(this.pageRequest)
      .then( roomPayments => {
        this.totalCount = roomPayments.totalCount;
        this.dataSource.data = roomPayments.data as RoomPayment[];
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      })
      .catch( err => {});
  }
  updateRoomPayment(roomPaymentObjectId: string): void {
    this.router.navigate([`payment/update-room-payment/${roomPaymentObjectId}`]);
  }
  setRoomStatus(statuses: Array<{value: string, balance?: number}>): Array<string> {
    const tenantstatuses: Array<string> = [];
    const roomStatuses:   Array<string> = [];
    statuses.forEach(status => {
      tenantstatuses.push(status.value);
    });
     if (tenantstatuses.includes(PaymentStatus.PAID)) {
       roomStatuses.push(PaymentStatus.PAID);
     }
     if (tenantstatuses.includes(PaymentStatus.UNPAID)) {
       roomStatuses.push(PaymentStatus.UNPAID);
     }
     if (tenantstatuses.includes(PaymentStatus.BALANCE)) {
       roomStatuses.push(PaymentStatus.BALANCE);
     }
     if (tenantstatuses.includes(PaymentStatus.NONE)) {
       roomStatuses.push(PaymentStatus.NONE);
     }
     return roomStatuses;
  }
  arrangeRoomPaymentFilters(searchResult: object): object {
    const arrangedSearchResult = { firstFilter: {}, secondFilter: {}};
    Object.entries(searchResult).forEach( element => {
      if (element[0] !== 'rentStatus') {
        arrangedSearchResult.firstFilter[element[0]] = element[1];
      } else {
        arrangedSearchResult.firstFilter['rentStatus'] = true;
        arrangedSearchResult.secondFilter[element[0]] = element[1];
      }
    });
    return arrangedSearchResult;
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      RoomPaymentAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        const filterType = FilterType.ADVANCESEARCHROOMPAYMENT;
        const filter     = this.arrangeRoomPaymentFilters(
                            this.objectService.removeNullValuesInSearchResult(searchResult)
                          );
        this.pageRequest.filters.type = filterType;
        this.pageRequest.filters.roomPaymentFilter =  filter;
        this.localStorageService.setItem('roomPaymentFilterType', filterType);
        this.localStorageService.setItem('roomPaymentFilter', filter);
        this.getRoomPayments();
      }
    });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.localStorageService.setItem('roomPaymentPage', $event.pageIndex);
  }
  displayAllRoomPayments(): void {
    this.localStorageService.remove('roomPaymentFilterType');
    this.localStorageService.remove('roomPaymentFilter');
    this.localStorageService.remove('roomPaymentPage');
    this.pageRequest.filters = { type: FilterType.ALLROOMPAYMENTS };
    this.getRoomPayments();
  }

}
