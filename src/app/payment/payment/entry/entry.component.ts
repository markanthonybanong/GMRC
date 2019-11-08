import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { PageRequest, Entry } from '@gmrc/models';
import { Router } from '@angular/router';
import { PaymentService, ObjectService, LocalStorageService } from '@gmrc/services';
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
  pageSizeOptions: number[] = [10, 20, 30, 40];
  pageRequest = new PageRequest(null, null);
  dataSource = new MatTableDataSource<Entry>();
  totalCount: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private objectService: ObjectService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.pageRequest.filters.type = FilterType.ALLENTRIES;
    this.getEntries();
  }
  displayPreviousPage(): void {
    const filterType = this.localStorageService.getItem('entryFilterType');
    const filter     = this.localStorageService.getItem('entryFilter');
    const page       = this.localStorageService.getItem('entryPage');

    if ( filterType !== null ) {
      this.pageRequest.filters.type = filterType;
    }
    if ( filter !== null ) {
      this.pageRequest.filters.entryFilter = filter;
    }
    if ( page !== null) {
      this.paginator.pageIndex = page;
    }
  }
  getEntries(): void {
    this.displayPreviousPage();
    this.paymentService.getEntries<Entry>(this.pageRequest)
     .then( entries => {
        this.totalCount = entries.totalCount;
        this.dataSource.data = entries.data as Entry[];
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
     })
     .catch( err => {
     });
  }
  addEntry(): void {
    this.router.navigate([`payment/add-entry`]);
  }
  convertDateToDateString(date: Date): string {
    return date !== null ? moment(date).format('MM/DD/YYYY') : null;
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
        const filter = this.objectService.removeNullValuesInSearchResult(
                        this.removeTenantNameInSearchResult(searchResult)
                       );
        this.pageRequest.filters.type = FilterType.ADVANCESEARCHENTRY;
        this.pageRequest.filters.entryFilter = filter;
        this.localStorageService.setItem('entryFilterType', FilterType.ADVANCESEARCHENTRY);
        this.localStorageService.setItem('entryFilter', filter);
        this.getEntries();
      }
    });
  }
  updateEntry(entryObjectId: string): void {
    this.router.navigate([`payment/update-entry/${entryObjectId}`]);
  }
  onPaginatorUpdate($event: PageEvent): void {
    this.localStorageService.setItem('entryPage', $event.pageIndex);
  }
  displayAllEntries(): void {
    this.localStorageService.remove('entryFilterType');
    this.localStorageService.remove('entryFilter');
    this.localStorageService.remove('entryPage');
    this.pageRequest.filters = { type: FilterType.ALLENTRIES };
    this.getEntries();
  }
}
