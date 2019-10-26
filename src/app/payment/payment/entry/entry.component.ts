import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { PageRequest, Entry } from '@gmrc/models';
import { Router } from '@angular/router';
import { PaymentService, ObjectService } from '@gmrc/services';
import { FilterType } from '@gmrc/enums';
import { EntryAdvanceSearchComponent } from '@gmrc/shared';
import * as moment from 'moment';

@Component({
  selector: 'app-enter',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit{
  isLoading = true;
  displayedColumns: string[] = [
    'roomNumber',
    'tenant',
    'monthlyRent',
    'key',
    'oneMonthDeposit',
    'oneMonthAdvance',
    'dateEntry',
    'dateExit',
    'actions'
  ];
  pageSizeOptions: number[] = [5, 10, 15];
  pageRequest = new PageRequest(1, this.pageSizeOptions[0]);
  dataSource = new MatTableDataSource<Entry>();
  totalCount: number;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private objectService: ObjectService
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLENTRIES;
    this.getEntries();
  }
  getEntries(): void {
    this.paymentService.getEntries<Entry>(this.pageRequest)
     .then( entries => {
        this.totalCount = entries.totalCount;
        this.dataSource.data = entries.data as Entry[];
        this.isLoading = false;
     })
     .catch( err => {
     });
  }
  addEntry(): void {
    this.router.navigate([`payment/add-entry`]);
  }
  convertDateToDateString(date: Date): string {
    return date !== null ? moment(date).format('MM-DD-YYYY') : null;
  }
  removeTenantNameInSearchResult(searchResult: object): object {
    const filteredSearchResult = {};
    Object.entries(searchResult).forEach( element => {
      if (element[0] !== 'tenantName') {
        filteredSearchResult[element[0]] = element[1];
      }
    });
    return filteredSearchResult;
  }
  onAdvanceSearch(): void {
    const dialogRef = this.dialog.open(
      EntryAdvanceSearchComponent,
      {}
    );
    dialogRef.afterClosed().subscribe(searchResult => {
      if (searchResult) {
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHENTRY;
        this.pageRequest.filters.entryFilter = this.objectService.removeNullValuesInSearchResult(
          this.removeTenantNameInSearchResult(searchResult));
        console.log(this.pageRequest);
        this.getEntries();
      }
    });
  }
  updateEntry(entryObjectId: string): void {
    this.router.navigate([`payment/update-entry/${entryObjectId}`]);
  }
}
