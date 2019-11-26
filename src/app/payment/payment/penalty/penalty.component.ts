import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageRequest, Penalty } from '@gmrc/models';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
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
  pageRequest = new PageRequest(null, null);
  totalCount: number;
  dataSource = new MatTableDataSource<Penalty>();
  pageSizeOptions: number[] = [10, 20, 30, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
      this.dataSource.paginator = this.paginator;
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
        const filterType = FilterType.ADVANCESEARCHPENALTY;
        this.pageRequest.filters.type = filterType;
        this.pageRequest.filters.penaltyFilter = this.objectService.removeNullValuesInSearchResult(searchResult);
        this.getPenalties();
      }
    });
  }

}
