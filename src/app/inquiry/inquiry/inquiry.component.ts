import { Component, OnInit, ViewChild } from '@angular/core';
import { PageRequest, Inquiry} from '@gmrc/models';
import { MatTableDataSource, MatDialog, PageEvent, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { InquiryService, NotificationService, ObjectService, LocalStorageService } from '@gmrc/services';
import { ConfirmationDialogComponent, InquiryAdvanceSearchComponent } from '@gmrc/shared';
import { FilterType, InquiryFilter, InquiryStatus } from '@gmrc/enums';
import * as moment from 'moment';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'roomType',
    'roomNumber',
    'willOccupyIn',
    'foundGMRCthrough',
    'status',
    'actions',
  ];
  pageSizeOptions: number[] = [10, 20, 30, 40];
  isLoading = true;
  pageRequest = new PageRequest(null, null);
  totalCount: number;
  dataSource = new MatTableDataSource<Inquiry>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private inquiryService: InquiryService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private objectService: ObjectService,
    private localStorageService: LocalStorageService
    ) { }
  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLINQUIRIES;
    this.getInquiries();
  }
  addInquiry(): void {
    this.router.navigate(['inquiry/add']);
  }
  displayPreviousPage(): void {
    const filterType = this.localStorageService.getItem('inquiryFilterType');
    const filter     = this.localStorageService.getItem('inquiryFilter');
    const page       = this.localStorageService.getItem('inquiryPage');
    if ( filterType !== null ) {
      this.pageRequest.filters.type = filterType;
    }
    if ( filter !== null) {
      this.pageRequest.filters.inquiryFilter = filter;
    }
    if ( page !== null) {
      this.paginator.pageIndex = page;
    }
  }
  getInquiries(): void {
    console.log(this.pageRequest);
    this.displayPreviousPage();
    this.inquiryService.getInquiries<Inquiry>(this.pageRequest)
    .then( inquiries => {
      this.totalCount = inquiries.totalCount;
      this.dataSource.data = inquiries.data as Inquiry[];
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    })
    .catch( err => {
    });
  }
  updateInquiry(inquiryObjectId: string): void {
    this.router.navigate([`inquiry/update/${inquiryObjectId}`]);
  }
  convertDateToDateString(date: Date): string {
    return moment(date).format('dddd LL');
  }
  isShowWillOccupyInWarningMsg(willOccupyIn: Date): boolean {
    return moment().isAfter(willOccupyIn, 'day');
  }
  warningMessage(willOccupyInDate: Date, name: string): string {
    return `${moment().diff(willOccupyInDate, 'days')} day/s over, since reservation date`;
  }
  deleteInquiry(inquiryId: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Inquiry',
        content: `Are you sure you want to remove ${name}'s inquiry?`
      }
    });
    dialogRef.afterClosed().subscribe( removeInquiry => {
      if (removeInquiry) {
        this.inquiryService.removeInquiry(inquiryId)
        .then( inquiry => {
          this.notificationService.notifySuccess(`Removed  ${inquiry.name}'s inquiry`);
          this.getInquiries();
        })
        .catch ( err => {
          this.notificationService.notifyFailed('Something went wrong');
        });
      }
    });
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      InquiryAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        const filterType = FilterType.ADVANCESEARCHINQUIRY;
        const filter     = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.pageRequest.filters.type = filterType;
        this.pageRequest.filters.inquiryFilter = filter;
        this.localStorageService.setItem('inquiryFilterType', filterType);
        this.localStorageService.setItem('inquiryFilter', filter);
        this.getInquiries();
      }
    });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.localStorageService.setItem('inquiryPage', $event.pageIndex);
  }
  displayAllInquiries(): void {
    this.localStorageService.remove('inquiryFilterType');
    this.localStorageService.remove('inquiryFilter');
    this.localStorageService.remove('inquiryPage');
    this.pageRequest.filters = { type: FilterType.ALLINQUIRIES} ;
    this.getInquiries();
  }
}
