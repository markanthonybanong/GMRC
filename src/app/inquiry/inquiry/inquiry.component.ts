import { Component, OnInit } from '@angular/core';
import { PageRequest, Inquiry} from '@gmrc/models';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { InquiryService, NotificationService, ObjectService } from '@gmrc/services';
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
  pageSizeOptions: number[] = [5, 10, 15];
  isLoading = true;
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  totalCount: number;
  dataSource = new MatTableDataSource<Inquiry>();

  constructor(
    private router: Router,
    private inquiryService: InquiryService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private objectService: ObjectService) { }
  ngOnInit() {
    this.getInquiries();
  }
  addInquiry(): void {
    this.router.navigate(['inquiry/add']);
  }
  getInquiries(): void {
    this.inquiryService.getInquiries<Inquiry>(this.pageRequest)
    .then( inquiries => {
      this.totalCount = inquiries.totalCount;
      this.dataSource.data = inquiries.data as Inquiry[];
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
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHINQUIRY;
        this.pageRequest.filters.inquiryFilter = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.getInquiries();
      }
    });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.pageRequest.limit = $event.pageSize;
    this.pageRequest.page = $event.pageIndex + 1;
    this.getInquiries();
  }
}
