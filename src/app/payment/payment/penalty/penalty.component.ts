import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageRequest, Penalty } from '@gmrc/models';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { FilterType } from '@gmrc/enums';
import { PaymentService, NotificationService, ObjectService } from '@gmrc/services';
import * as moment from 'moment';
import { ConfirmationDialogComponent, PenaltyAdvanceSearchComponent } from 'src/app/shared';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss']
})
export class PenaltyComponent implements OnInit {
  displayedColumns: string[] = [
    'roomNumber',
    'date',
    'tenant',
    'violation',
    'fine',
    'actions',
  ];
  isLoading = true;
  pageSizeOptions: number[] = [10, 20, 30, 40];
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  totalCount: number;
  dataSource = new MatTableDataSource<Penalty>();

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private objectService: ObjectService
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLPENALTIES;
    this.getPenalties();
  }
  async getPenalties(): Promise<void> {
    try {
      const penalties           = await this.paymentService.getPenalties<Penalty>(this.pageRequest);
      this.totalCount           = penalties.totalCount;
      this.dataSource.data      = penalties.data as Penalty[];
      this.isLoading            = false;
    } catch (error) {
    }
  }
  addPenalty(): void {
    this.router.navigate(['payment/add-penalty']);
  }
  displayAllPenalties(): void {
    this.pageRequest.filters.type = FilterType.ALLPENALTIES;
    this.getPenalties();
  }
  convertDateToDateString(date: Date): string {
    return moment(date).format('dddd LL');
  }
  updatePenalty(objectId: string): void {
    this.router.navigate([`payment/update-penalty/${objectId}`]);
  }
  deletePenalty(objectId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Remove Penalty',
        content: `Are you sure you want to remove this penalty?`
      }
    });
    dialogRef.afterClosed().subscribe( removePenalty => {
      if (removePenalty) {
        this.paymentService.removePenalty(objectId)
        .then( penalty => {
          this.notificationService.notifySuccess(`Removed penalty in room number ${penalty.roomNumber}`);
          this.getPenalties();
        })
        .catch ( err => {
          this.notificationService.notifyFailed('Something went wrong');
        });
      }
    });
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      PenaltyAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHPENALTY;
        this.pageRequest.filters.penaltyFilter = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.getPenalties();
      }
    });
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.pageRequest.page = $event.pageIndex + 1;
    this.pageRequest.limit = $event.pageSize;
    this.getPenalties();
  }

}
